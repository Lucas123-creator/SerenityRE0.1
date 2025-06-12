import { API_BASE_URL, ENDPOINTS } from '../../../shared/constants/endpoints';
import {
  Property,
  PropertySearch,
  PropertyList,
  ImageUpload
} from '../../../shared/types/properties';

export async function getProperties(
  page = 1,
  size = 10,
  filters?: { location?: string; property_type?: string; min_price?: number; max_price?: number }
): Promise<PropertyList> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
  }

  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROPERTIES.LIST}?${params}`);
  if (!response.ok) throw new Error('Failed to fetch properties');
  return response.json();
}

export async function searchProperties(search: PropertySearch): Promise<PropertyList> {
  const params = new URLSearchParams();
  Object.entries(search).forEach(([key, value]) => {
    if (value !== undefined) params.append(key, value.toString());
  });

  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROPERTIES.SEARCH}?${params}`);
  if (!response.ok) throw new Error('Failed to search properties');
  return response.json();
}

export async function getProperty(id: string): Promise<Property> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROPERTIES.DETAIL(id)}`);
  if (!response.ok) throw new Error('Failed to fetch property');
  return response.json();
}

export async function createProperty(
  property: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'images'>
): Promise<Property> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROPERTIES.LIST}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property)
  });
  if (!response.ok) throw new Error('Failed to create property');
  return response.json();
}

export async function updateProperty(
  id: string,
  property: Partial<Property>
): Promise<Property> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROPERTIES.DETAIL(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property)
  });
  if (!response.ok) throw new Error('Failed to update property');
  return response.json();
}

export async function deleteProperty(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROPERTIES.DETAIL(id)}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete property');
}

export async function uploadPropertyImages(
  id: string,
  files: File[]
): Promise<ImageUpload> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROPERTIES.IMAGES(id)}`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Failed to upload images');
  return response.json();
} 