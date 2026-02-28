import { api } from '../api';
import { Business, CreateBusinessData, UpdateBusinessData } from '@/types/business';

/**
 * Business API Service
 * Handles all business-related API calls
 */
export const businessService = {
  /**
   * Create a new business
   */
  async create(data: CreateBusinessData, files?: File[]): Promise<Business> {
    try {
      // If files are provided, use FormData
      if (files && files.length > 0) {
        const formData = new FormData();
        
        // Append business data as JSON string or individual fields
        Object.keys(data).forEach(key => {
          const value = data[key as keyof CreateBusinessData];
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        
        // Append files
        files.forEach(file => {
          formData.append('documents', file);
        });
        
        const response = await api.postFormData('/businesses', formData);
        return response;
      } else {
        // No files, send as JSON
        const response = await api.post('/businesses', data);
        return response;
      }
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  },

  /**
   * Get all businesses
   */
  async getAll(): Promise<Business[]> {
    try {
      const response = await api.get('/businesses');
      return response;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  },

  /**
   * Get businesses by owner UID
   */
  async getByOwner(ownerUid: string): Promise<Business[]> {
    try {
      const response = await api.get(`/businesses/owner/${ownerUid}`);
      return response;
    } catch (error) {
      console.error('Error fetching businesses by owner:', error);
      throw error;
    }
  },

  /**
   * Get a single business by ID
   */
  async getById(id: string): Promise<Business> {
    try {
      const response = await api.get(`/businesses/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw error;
    }
  },

  /**
   * Update a business
   */
  async update(id: string, data: UpdateBusinessData): Promise<Business> {
    try {
      const response = await api.put(`/businesses/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  },

  /**
   * Delete a business
   */
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/businesses/${id}`);
    } catch (error) {
      console.error('Error deleting business:', error);
      throw error;
    }
  },

  /**
   * Upload documents to an existing business
   */
  async uploadDocuments(id: string, files: File[]): Promise<Business> {
    try {
      const formData = new FormData();
      
      // Append files
      files.forEach(file => {
        formData.append('documents', file);
      });
      
      const response = await api.postFormData(`/businesses/${id}/upload-documents`, formData);
      return response;
    } catch (error) {
      console.error('Error uploading documents:', error);
      throw error;
    }
  },
};
