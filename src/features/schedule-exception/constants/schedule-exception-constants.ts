// src/features/schedule-exceptions/constants/schedule-exception-constants.ts
export const dayOfWeekOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];
  
  export const statusOptions = [
    { value: 0, label: 'Inactive' },
    { value: 1, label: 'Active' },
  ];
  
  export const getDayOfWeekLabel = (day: number) => {
    const dayOption = dayOfWeekOptions.find(option => option.value === day);
    return dayOption ? dayOption.label : 'Unknown';
  };
  
  export const getStatusLabel = (status: number) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : 'Unknown';
  };