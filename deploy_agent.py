import argparse
import json
import os
import shutil
import subprocess
from typing import Dict, Any
import docker
from jinja2 import Template

def load_config(config_path: str) -> Dict[str, Any]:
    with open(config_path, 'r') as f:
        return json.load(f)

def create_docker_compose(agency_id: str, config: Dict[str, Any]) -> None:
    template = """
version: '3.8'

services:
  ai-agent:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - AGENCY_ID={{ agency_id }}
      - AGENCY_NAME={{ config.branding.agencyName }}
      - PRIMARY_COLOR={{ config.branding.primaryColor }}
      - SECONDARY_COLOR={{ config.branding.secondaryColor }}
      - LISTINGS_URL={{ config.listings.sourceUrl }}
      - LISTINGS_API_KEY={{ config.listings.apiKey }}
      - REFRESH_INTERVAL={{ config.listings.refreshInterval }}
      - CRM_TYPE={{ config.integration.crm.type }}
      - CRM_API_KEY={{ config.integration.crm.apiKey }}
      - CRM_ENDPOINT={{ config.integration.crm.endpoint }}
      - CALENDAR_TYPE={{ config.integration.calendar.type }}
      - CALENDAR_CLIENT_ID={{ config.integration.calendar.credentials.clientId }}
      - CALENDAR_CLIENT_SECRET={{ config.integration.calendar.credentials.clientSecret }}
      - WHATSAPP_ENABLED={{ config.integration.whatsapp.enabled }}
      - WHATSAPP_PHONE={{ config.integration.whatsapp.phoneNumber }}
      - WHATSAPP_API_KEY={{ config.integration.whatsapp.apiKey }}
      - EMAIL_ENABLED={{ config.integration.email.enabled }}
      - SMTP_SERVER={{ config.integration.email.smtpServer }}
      - SMTP_PORT={{ config.integration.email.smtpPort }}
      - SMTP_USERNAME={{ config.integration.email.username }}
      - SMTP_PASSWORD={{ config.integration.email.password }}
      - FROM_ADDRESS={{ config.integration.email.fromAddress }}
      - PRIMARY_LANGUAGE={{ config.language.primaryLanguage }}
      - SUPPORTED_LANGUAGES={{ config.language.supportedLanguages | join(',') }}
    ports:
      - "8000:8000"
    volumes:
      - ./models:/app/models
      - ./data:/app/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - ai-agent
    restart: unless-stopped
    """

    # Create deployment directory
    os.makedirs(f"deployments/{agency_id}", exist_ok=True)
    
    # Render template
    template = Template(template)
    docker_compose = template.render(agency_id=agency_id, config=config)
    
    # Save docker-compose.yml
    with open(f"deployments/{agency_id}/docker-compose.yml", "w") as f:
        f.write(docker_compose)

def create_nginx_config(agency_id: str, config: Dict[str, Any]) -> None:
    template = """
events {
    worker_connections 1024;
}

http {
    upstream ai_agent {
        server ai-agent:8000;
    }

    server {
        listen 80;
        server_name {{ config.branding.agencyName | lower | replace(' ', '-') }}.serenity.ai;
        
        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl;
        server_name {{ config.branding.agencyName | lower | replace(' ', '-') }}.serenity.ai;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://ai_agent;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
    """
    
    # Render template
    template = Template(template)
    nginx_config = template.render(config=config)
    
    # Save nginx.conf
    with open(f"deployments/{agency_id}/nginx.conf", "w") as f:
        f.write(nginx_config)

def deploy_agent(agency_id: str, config_path: str) -> None:
    # Load configuration
    config = load_config(config_path)
    
    # Create deployment files
    create_docker_compose(agency_id, config)
    create_nginx_config(agency_id, config)
    
    # Copy necessary files
    shutil.copy("Dockerfile", f"deployments/{agency_id}/")
    shutil.copy("requirements.txt", f"deployments/{agency_id}/")
    
    # Create SSL directory
    os.makedirs(f"deployments/{agency_id}/ssl", exist_ok=True)
    
    # Generate SSL certificate (self-signed for development)
    subprocess.run([
        "openssl", "req", "-x509", "-nodes", "-days", "365",
        "-newkey", "rsa:2048",
        "-keyout", f"deployments/{agency_id}/ssl/key.pem",
        "-out", f"deployments/{agency_id}/ssl/cert.pem",
        "-subj", f"/CN={config['branding']['agencyName'].lower().replace(' ', '-')}.serenity.ai"
    ], check=True)
    
    # Build and start containers
    client = docker.from_env()
    
    # Build image
    client.images.build(
        path=f"deployments/{agency_id}",
        tag=f"serenity-ai-agent-{agency_id}",
        rm=True
    )
    
    # Start containers
    subprocess.run([
        "docker-compose",
        "-f", f"deployments/{agency_id}/docker-compose.yml",
        "up", "-d"
    ], check=True)

def main():
    parser = argparse.ArgumentParser(description="Deploy Serenity AI Agent")
    parser.add_argument("--agency-id", required=True, help="Agency ID")
    parser.add_argument("--config", required=True, help="Path to configuration file")
    
    args = parser.parse_args()
    
    try:
        deploy_agent(args.agency_id, args.config)
        print(f"Successfully deployed AI agent for agency {args.agency_id}")
    except Exception as e:
        print(f"Deployment failed: {str(e)}")
        raise

if __name__ == "__main__":
    main() 