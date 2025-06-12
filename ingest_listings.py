import argparse
import json
import logging
import os
import re
from typing import List, Dict, Any

from urllib.parse import urlparse

# For static scraping
import requests
from bs4 import BeautifulSoup

# For dynamic scraping
try:
    from playwright.sync_api import sync_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[logging.StreamHandler()]
)

def is_dynamic_page(url: str) -> bool:
    """Heuristically determine if a page is dynamic (JS-heavy) or static."""
    try:
        resp = requests.get(url, timeout=10)
        if 'text/html' not in resp.headers.get('Content-Type', ''):
            return False
        # Heuristic: if <script> tags are more than X% of HTML, likely dynamic
        soup = BeautifulSoup(resp.text, 'html.parser')
        scripts = soup.find_all('script')
        if len(scripts) > 10 or any('window.__' in s.text for s in scripts if s.string):
            return True
        return False
    except Exception as e:
        logging.warning(f"Failed to check if page is dynamic: {e}")
        return True  # Default to dynamic if unsure

def clean_text(text: str) -> str:
    return re.sub(r'\s+', ' ', text).strip()

def extract_static(url: str) -> List[Dict[str, Any]]:
    resp = requests.get(url, timeout=15)
    soup = BeautifulSoup(resp.text, 'html.parser')
    return [extract_listing_from_soup(soup)]

def extract_dynamic(url: str) -> List[Dict[str, Any]]:
    if not PLAYWRIGHT_AVAILABLE:
        raise ImportError("Playwright is not installed. Please install it for dynamic scraping.")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, timeout=30000)
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        listings = [extract_listing_from_soup(soup)]
        browser.close()
        return listings

def extract_listing_from_soup(soup: BeautifulSoup) -> Dict[str, Any]:
    # These selectors are generic; for production, customize per site
    title = soup.find(['h1', 'h2'], class_=re.compile(r'(title|headline)', re.I))
    if not title:
        title = soup.find(['h1', 'h2'])
    title = clean_text(title.get_text()) if title else None

    price = soup.find(string=re.compile(r'\$|€|AED|USD|\d{3,}'))
    if price:
        price = re.sub(r'[^\d.]', '', price)
        try:
            price = float(price)
        except Exception:
            price = None
    else:
        price = None

    location = soup.find(class_=re.compile(r'(location|address|area)', re.I))
    if not location:
        location = soup.find('address')
    location = clean_text(location.get_text()) if location else None

    desc = soup.find('div', class_=re.compile(r'(description|desc|details)', re.I))
    if not desc:
        desc = soup.find('p')
    description = clean_text(desc.get_text()) if desc else None

    media = []
    for img in soup.find_all('img'):
        src = img.get('src')
        if src and src.startswith('http'):
            media.append(src)
    for video in soup.find_all('video'):
        src = video.get('src')
        if src and src.startswith('http'):
            media.append(src)

    return {
        "title": title,
        "price": price,
        "location": location,
        "description": description,
        "media": media
    }

def validate_listing(listing: Dict[str, Any]) -> bool:
    return bool(listing.get('title')) and isinstance(listing.get('price'), float)

def ingest_listings(url: str, output_path: str = "listings.json"):
    logging.info(f"Starting ingestion for {url}")
    try:
        dynamic = is_dynamic_page(url)
        if dynamic:
            logging.info("Detected dynamic page. Using Playwright.")
            listings = extract_dynamic(url)
        else:
            logging.info("Detected static page. Using requests/BeautifulSoup.")
            listings = extract_static(url)
    except Exception as e:
        logging.error(f"Failed to scrape {url}: {e}")
        return

    valid_listings = []
    for listing in listings:
        if validate_listing(listing):
            valid_listings.append(listing)
            logging.info(f"Extracted: {listing['title']} at {listing['price']}")
        else:
            logging.warning(f"Skipped invalid listing: {listing}")

    # TODO: Structure listings for Supabase insert schema here
    # TODO: Integrate with Supabase or next-agent ingest here

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(valid_listings, f, indent=2, ensure_ascii=False)
    logging.info(f"Saved {len(valid_listings)} listings to {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Ingest real estate listings from a URL.")
    parser.add_argument('url', type=str, help='URL to scrape')
    parser.add_argument('--output', type=str, default='listings.json', help='Output JSON file')
    args = parser.parse_args()
    ingest_listings(args.url, args.output)

if __name__ == "__main__":
    main() 