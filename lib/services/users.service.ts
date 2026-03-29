import type { User, ApiResponse } from "@/types";
import { api } from "../api";

// ==========================================
// BACKEND SHAPE
// ==========================================

interface BackendUser {
  _id: string;
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function convertUser(u: BackendUser): User {
  return {
    id: u._id,
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    phoneNumber: u.phoneNumber,
    isActive: u.isActive,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

// ==========================================
// USERS API
// ==========================================

export async function getUsers(): Promise<ApiResponse<User[]>> {
  try {
    const data = await api.get<BackendUser[]>("/users");
    return { success: true, data: data.map(convertUser) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
      data: [],
    };
  }
}

export async function getUserByUid(
  uid: string,
): Promise<ApiResponse<User | null>> {
  try {
    const data = await api.get<BackendUser>(`/users/uid/${uid}`);
    return { success: true, data: convertUser(data) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "User not found",
      data: null,
    };
  }
}

export async function updateUser(
  uid: string,
  data: Partial<Pick<User, "displayName" | "phoneNumber">>,
): Promise<ApiResponse<User>> {
  try {
    const updated = await api.patch<BackendUser>(`/users/${uid}`, data);
    return { success: true, data: convertUser(updated) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
      data: null as unknown as User,
    };
  }
}
