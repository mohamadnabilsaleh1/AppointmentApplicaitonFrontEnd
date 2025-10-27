// src/features/departments/hooks/useDepartments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateDepartmentRequest, DepartmentsQueryParams } from '../types/department';
import { departmentService } from '../services/department-service';

export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (params: DepartmentsQueryParams) => [...departmentKeys.lists(), params] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
  doctors: (departmentId: string) => [...departmentKeys.detail(departmentId), 'doctors'] as const,
};

export const useDepartments = (params: DepartmentsQueryParams, token: string) => {
  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: () => departmentService.getMyDepartments(params, token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDepartment = (id: string, token: string) => {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentService.getDepartmentById(id, token),
    enabled: !!token && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDepartment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) =>
      departmentService.createDepartment(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useUpdateDepartment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateDepartmentRequest }) =>
      departmentService.updateDepartment(id, data, token),
    onSuccess: (updatedDepartment, variables) => {
      queryClient.setQueryData(departmentKeys.detail(variables.id), updatedDepartment);
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useDeleteDepartment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentService.deleteDepartment(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useDepartmentDoctors = (departmentId: string, params: { page: number; pageSize: number }, token: string) => {
  return useQuery({
    queryKey: [...departmentKeys.doctors(departmentId), params],
    queryFn: () => departmentService.getDepartmentDoctors(departmentId, params, token),
    enabled: !!token && !!departmentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddDoctorToDepartment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, doctorId }: { departmentId: string; doctorId: string }) =>
      departmentService.addDoctorToDepartment(departmentId, doctorId, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.doctors(variables.departmentId) });
    },
  });
};

export const useRemoveDoctorFromDepartment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, doctorId }: { departmentId: string; doctorId: string }) =>
      departmentService.removeDoctorFromDepartment(departmentId, doctorId, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.doctors(variables.departmentId) });
    },
  });
};