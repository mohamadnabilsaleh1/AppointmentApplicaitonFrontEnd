// src/features/phones/constants/phone-constants.ts
export const phoneLabelOptions = [
    { value: 'mobile', label: 'Mobile' },
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'other', label: 'Other' },
  ];
  
  export const getPhoneLabel = (label: string) => {
    const option = phoneLabelOptions.find(opt => opt.value === label);
    return option ? option.label : label;
  };