import { api } from '../api';
import { Business, CreateBusinessData, UpdateBusinessData } from '@/types/business';

export const businessService = {
  async create(data: CreateBusinessData, files?: File[]): Promise<Business> {
    if (files && files.length > 0) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof CreateBusinessData];
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      files.forEach((file) => formData.append('documents', file));
      return api.postFormData<Business>('/businesses', formData);
    }
    return api.post<Business>('/businesses', data);
  },

  async getAll(): Promise<Business[]> {
    return api.get<Business[]>('/businesses');
  },

  async getByOwner(ownerUid: string): Promise<Business[]> {
    return api.get<Business[]>(`/businesses?ownerUid=${ownerUid}`);
  },

  async getById(id: string): Promise<Business> {
    return api.get<Business>(`/businesses/${id}`);
  },

  async update(id: string, data: UpdateBusinessData): Promise<Business> {
    return api.put<Business>(`/businesses/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/businesses/${id}`);
  },

  async uploadDocuments(id: string, files: File[]): Promise<Business> {
    const formData = new FormData();
    files.forEach((file) => formData.append('documents', file));
    return api.postFormData<Business>(`/businesses/${id}/upload-documents`, formData);
  },
};
