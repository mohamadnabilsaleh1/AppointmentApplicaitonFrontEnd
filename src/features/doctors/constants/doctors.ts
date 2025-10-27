// src/constants/doctors.ts
export const genderOptions = [
    { value: 0, label: 'Male' },
    { value: 1, label: 'Female' },
    { value: 2, label: 'Other' },
  ];
  
  export const specializationOptions = [
    { value: 0, label: 'General Practice' },
    { value: 1, label: 'Cardiology' },
    { value: 2, label: 'Dermatology' },
    { value: 3, label: 'Neurology' },
    { value: 4, label: 'Pediatrics' },
    { value: 5, label: 'Oncology' },
    { value: 6, label: 'Orthopedics' },
    { value: 7, label: 'Psychiatry' },
    { value: 8, label: 'Surgery' },
    { value: 9, label: 'Radiology' },
  ];
  
  export const getGenderLabel = (genderValue: number) => {
    const gender = genderOptions.find(g => g.value === genderValue);
    return gender ? gender.label : 'Unknown';
  };
  
  export const getSpecializationLabel = (specializationValue: number) => {
    const specialization = specializationOptions.find(s => s.value === specializationValue);
    return specialization ? specialization.label : 'Unknown';
  };