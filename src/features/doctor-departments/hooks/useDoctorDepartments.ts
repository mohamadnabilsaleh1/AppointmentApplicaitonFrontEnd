// src/features/doctor-departments/hooks/useDoctorDepartments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AssignDoctorToDepartmentRequest, DoctorDepartmentQueryParams } from '../types/doctor-department';
import { doctorDepartmentService } from '../services/doctor-department-service';

export const doctorDepartmentKeys = {
  all: ['doctor-departments'] as const,
  lists: () => [...doctorDepartmentKeys.all, 'list'] as const,
  list: (params: DoctorDepartmentQueryParams) => [...doctorDepartmentKeys.lists(), params] as const,
  departmentDoctors: (departmentId: string) => [...doctorDepartmentKeys.all, 'department', departmentId, 'doctors'] as const,
  doctorDepartments: (doctorId: string) => [...doctorDepartmentKeys.all, 'doctor', doctorId, 'departments'] as const,
};

export const useAssignDoctorToDepartment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignDoctorToDepartmentRequest) =>
      doctorDepartmentService.assignDoctorToDepartment(data, token),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: doctorDepartmentKeys.departmentDoctors(variables.departmentId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: doctorDepartmentKeys.doctorDepartments(variables.doctorId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: doctorDepartmentKeys.lists() 
      });
    },
  });
};

export const useRemoveDoctorFromDepartment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, doctorId }: { departmentId: string; doctorId: string }) =>
      doctorDepartmentService.removeDoctorFromDepartment(departmentId, doctorId, token),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: doctorDepartmentKeys.departmentDoctors(variables.departmentId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: doctorDepartmentKeys.doctorDepartments(variables.doctorId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: doctorDepartmentKeys.lists() 
      });
    },
  });
};

export const useDepartmentDoctors = (
  departmentId: string, 
  params: { page: number; pageSize: number }, 
  token: string
) => {
  return useQuery({
    queryKey: [...doctorDepartmentKeys.departmentDoctors(departmentId), params],
    queryFn: () => doctorDepartmentService.getDepartmentDoctors(departmentId, params, token),
    enabled: !!token && !!departmentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDoctorDepartments = (
  doctorId: string, 
  params: { page: number; pageSize: number }, 
  token: string
) => {
  return useQuery({
    queryKey: [...doctorDepartmentKeys.doctorDepartments(doctorId), params],
    queryFn: () => doctorDepartmentService.getDoctorDepartments(doctorId, params, token),
    enabled: !!token && !!doctorId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllDoctorDepartments = (params: DoctorDepartmentQueryParams, token: string) => {
  return useQuery({
    queryKey: doctorDepartmentKeys.list(params),
    queryFn: () => doctorDepartmentService.getAllDoctorDepartments(params, token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};