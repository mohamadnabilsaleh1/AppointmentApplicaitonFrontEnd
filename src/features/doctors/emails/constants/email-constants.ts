// src/features/emails/constants/email-constants.ts
export const emailLabelOptions = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'other', label: 'Other' },
  ];
  
  export const getEmailLabel = (label: string) => {
    const option = emailLabelOptions.find(opt => opt.value === label);
    return option ? option.label : label;
  };