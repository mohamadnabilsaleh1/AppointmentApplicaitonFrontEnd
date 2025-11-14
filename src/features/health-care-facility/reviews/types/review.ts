// types/review.ts
export interface Review {
    Id: string;
    Rating: number;
    Comment: string;
    CreatedAtUtc: string;
    UpdatedAtUtc: string | null;
    AppointmentId: string;
    PatientId: string;
    PatientFirstName: string;
    PatientLastName: string;
    PatientFullName: string;
    PatientEmail: string;
    DoctorId: string;
    DoctorFirstName: string;
    DoctorLastName: string;
    DoctorSpecialization: string;
    DoctorFullName: string;
    FacilityId: string;
    FacilityName: string;
    AppointmentDate: string;
    AppointmentTime: string;
    AppointmentStatus: string;
  }
  
  export interface ReviewsResponse {
    data: Review[];
    pagination: {
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    };
    links: Array<{
      href: string;
      rel: string;
      method: string;
    }>;
  }
  
  export interface ReviewsQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sort?: string;
    fields?: string;
    minRating?: number;
    maxRating?: number;
    fromDate?: string;
    toDate?: string;
    doctorId?: string;
    patientId?: string;
  }