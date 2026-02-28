// Business types
export interface Business {
  _id: string;
  name: string;
  description?: string;
  ownerUid: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessData {
  name: string;
  description?: string;
  ownerUid: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface UpdateBusinessData {
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}
