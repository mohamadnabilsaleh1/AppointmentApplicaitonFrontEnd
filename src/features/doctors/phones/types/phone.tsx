// src/features/phones/types/phone.ts
export interface Phone {
    id: string;
    phoneNumber: string;
    label: string;
    isPrimary: boolean;
  }
  
  export interface PhonesResponse {
    data: Phone[];
    links: Array<{ href: string; rel: string; method: string }>;
  }
  
  export interface CreatePhoneRequest {
    phoneNumber: string;
    label: string;
    isPrimary: boolean;
  }
  
  export interface UpdatePhoneRequest {
    phoneNumber: string;
    label: string;
    isPrimary: boolean;
  }
  
  export interface PhonesQueryParams {
    page?: number;
    pageSize?: number;
  }