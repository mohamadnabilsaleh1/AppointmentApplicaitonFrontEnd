// src/features/emails/types/email.ts
export interface Email {
    id: string;
    emailAddress: string;
    label: string;
    isPrimary: boolean;
  }
  
  export interface EmailsResponse {
    data: Email[];
    links: Array<{ href: string; rel: string; method: string }>;
  }
  
  export interface CreateEmailRequest {
    emailAddress: string;
    label: string;
    isPrimary: boolean;
  }
  
  export interface UpdateEmailRequest {
    emailAddress: string;
    label: string;
    isPrimary: boolean;
  }
  
  export interface EmailsQueryParams {
    page?: number;
    pageSize?: number;
  }