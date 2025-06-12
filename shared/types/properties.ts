export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  VILLA = 'villa',
  LAND = 'land',
  COMMERCIAL = 'commercial'
}

export enum PropertyStatus {
  ACTIVE = 'active',
  SOLD = 'sold',
  HIDDEN = 'hidden'
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  property_type: PropertyType;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
  images: string[];
}

export interface PropertySearch {
  location?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  property_type?: PropertyType;
  page: number;
  size: number;
}

export interface PropertyList {
  items: Property[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ImageUpload {
  urls: string[];
} 