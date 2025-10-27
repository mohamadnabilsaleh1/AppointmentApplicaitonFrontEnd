import { MedicalReport } from '../types/medical'

export const HEALTH_CARE_FACILITY_MEDICAL_DATA: MedicalReport[] = [
  // Cardiology - أمراض القلب
  { id: '1', city: 'دمشق', ageGroup: '46-55', disease: 'ارتفاع ضغط الدم', specialization: 'Cardiology', count: 67, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '2', city: 'دمشق', ageGroup: '56+', disease: 'قصور القلب', specialization: 'Cardiology', count: 34, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'جراحة' },
  { id: '3', city: 'حلب', ageGroup: '36-45', disease: 'ذبحة صدرية', specialization: 'Cardiology', count: 23, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  
  // Dermatology - أمراض الجلد
  { id: '4', city: 'حمص', ageGroup: '18-25', disease: 'حب الشباب', specialization: 'Dermatology', count: 89, date: '2024-01', severity: 'منخفض', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '5', city: 'اللاذقية', ageGroup: '26-35', disease: 'الصدفية', specialization: 'Dermatology', count: 45, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'علاج طبيعي' },
  
  // Endocrinology - الغدد الصماء
  { id: '6', city: 'دمشق', ageGroup: '36-45', disease: 'السكري النوع الثاني', specialization: 'Endocrinology', count: 156, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '7', city: 'حلب', ageGroup: '46-55', disease: 'قصور الغدة الدرقية', specialization: 'Endocrinology', count: 78, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  
  // Gastroenterology - الجهاز الهضمي
  { id: '8', city: 'درعا', ageGroup: '26-35', disease: 'قرحة المعدة', specialization: 'Gastroenterology', count: 34, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '9', city: 'حمص', ageGroup: '56+', disease: 'التهاب القولون', specialization: 'Gastroenterology', count: 56, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'مراقبة' },
  
  // Neurology - الأعصاب
  { id: '10', city: 'دمشق', ageGroup: '56+', disease: 'الزهايمر', specialization: 'Neurology', count: 42, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'مراقبة' },
  { id: '11', city: 'حلب', ageGroup: '36-45', disease: 'الصداع النصفي', specialization: 'Neurology', count: 67, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  
  // Pulmonology - الجهاز التنفسي
  { id: '12', city: 'حمص', ageGroup: '18-25', disease: 'الربو', specialization: 'Pulmonology', count: 89, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '13', city: 'اللاذقية', ageGroup: '56+', disease: 'انسداد رئوي مزمن', specialization: 'Pulmonology', count: 45, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'علاج طبيعي' },
  
  // Orthopedics - العظام
  { id: '14', city: 'درعا', ageGroup: '46-55', disease: 'هشاشة العظام', specialization: 'Orthopedics', count: 78, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'علاج طبيعي' },
  { id: '15', city: 'دمشق', ageGroup: '26-35', disease: 'إصابة رياضية', specialization: 'Orthopedics', count: 34, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'علاج طبيعي' },
  
  // Pediatrics - طب الأطفال
  { id: '16', city: 'حلب', ageGroup: '18-25', disease: 'التهاب الأذن الوسطى', specialization: 'Pediatrics', count: 112, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '17', city: 'حمص', ageGroup: '18-25', disease: 'الحصبة', specialization: 'Pediatrics', count: 56, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  
  // Ophthalmology - العيون
  { id: '18', city: 'اللاذقية', ageGroup: '56+', disease: 'إعتام عدسة العين', specialization: 'Ophthalmology', count: 67, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'جراحة' },
  { id: '19', city: 'دمشق', ageGroup: '36-45', disease: 'جلوكوما', specialization: 'Ophthalmology', count: 23, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  
  // Psychiatry - الطب النفسي
  { id: '20', city: 'حلب', ageGroup: '26-35', disease: 'الاكتئاب', specialization: 'Psychiatry', count: 89, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '21', city: 'دمشق', ageGroup: '18-25', disease: 'قلق عام', specialization: 'Psychiatry', count: 67, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'دوائي' },
  
  // Additional data for more cities and specializations
  { id: '22', city: 'دمشق', ageGroup: '46-55', disease: 'السكري النوع الأول', specialization: 'Endocrinology', count: 45, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '23', city: 'حلب', ageGroup: '56+', disease: 'الروماتيزم', specialization: 'Rheumatology', count: 34, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '24', city: 'حمص', ageGroup: '36-45', disease: 'حصى الكلى', specialization: 'Urology', count: 56, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'جراحة' },
  { id: '25', city: 'اللاذقية', ageGroup: '26-35', disease: 'فقر الدم', specialization: 'Hematology', count: 78, date: '2024-01', severity: 'منخفض', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '26', city: 'درعا', ageGroup: '18-25', disease: 'التهاب الكبد الوبائي', specialization: 'InfectiousDisease', count: 23, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'مراقبة' },
  { id: '27', city: 'دمشق', ageGroup: '46-55', disease: 'سرطان الثدي', specialization: 'Oncology', count: 45, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'جراحة' },
  { id: '28', city: 'حلب', ageGroup: '56+', disease: 'الفشل الكلوي', specialization: 'Nephrology', count: 34, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'مراقبة' },
  
  // December 2023 data for comparison
  { id: '29', city: 'دمشق', ageGroup: '36-45', disease: 'ارتفاع ضغط الدم', specialization: 'Cardiology', count: 58, date: '2023-12', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '30', city: 'حلب', ageGroup: '26-35', disease: 'السكري النوع الثاني', specialization: 'Endocrinology', count: 134, date: '2023-12', severity: 'عالي', gender: 'أنثى', treatmentType: 'دوائي' },
]

export const MEDICAL_DATA: MedicalReport[] = [
  // Cardiology - أمراض القلب (15 records)
  { id: '1', city: 'دمشق', ageGroup: '46-55', disease: 'ارتفاع ضغط الدم', specialization: 'Cardiology', count: 67, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '2', city: 'دمشق', ageGroup: '56+', disease: 'قصور القلب', specialization: 'Cardiology', count: 34, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'جراحة' },
  { id: '3', city: 'حلب', ageGroup: '36-45', disease: 'ذبحة صدرية', specialization: 'Cardiology', count: 23, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '4', city: 'حمص', ageGroup: '56+', disease: 'عدم انتظام ضربات القلب', specialization: 'Cardiology', count: 45, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '5', city: 'اللاذقية', ageGroup: '26-35', disease: 'تضيق الصمام التاجي', specialization: 'Cardiology', count: 18, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'جراحة' },
  { id: '6', city: 'درعا', ageGroup: '46-55', disease: 'ارتفاع ضغط الدم', specialization: 'Cardiology', count: 52, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '7', city: 'حماة', ageGroup: '36-45', disease: 'قصور القلب', specialization: 'Cardiology', count: 28, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '8', city: 'دير الزور', ageGroup: '56+', disease: 'ذبحة صدرية', specialization: 'Cardiology', count: 31, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '9', city: 'السويداء', ageGroup: '46-55', disease: 'ارتفاع ضغط الدم', specialization: 'Cardiology', count: 41, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '10', city: 'القنيطرة', ageGroup: '36-45', disease: 'عدم انتظام ضربات القلب', specialization: 'Cardiology', count: 15, date: '2024-01', severity: 'منخفض', gender: 'أنثى', treatmentType: 'مراقبة' },
  { id: '11', city: 'طرطوس', ageGroup: '56+', disease: 'قصور القلب', specialization: 'Cardiology', count: 37, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'جراحة' },
  { id: '12', city: 'إدلب', ageGroup: '26-35', disease: 'ارتفاع ضغط الدم', specialization: 'Cardiology', count: 29, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '13', city: 'الرقة', ageGroup: '46-55', disease: 'ذبحة صدرية', specialization: 'Cardiology', count: 26, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '14', city: 'دمشق', ageGroup: '18-25', disease: 'ارتفاع ضغط الدم', specialization: 'Cardiology', count: 19, date: '2024-01', severity: 'منخفض', gender: 'أنثى', treatmentType: 'مراقبة' },
  { id: '15', city: 'حلب', ageGroup: '0-17', disease: 'عيب خلقي في القلب', specialization: 'Cardiology', count: 12, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'جراحة' },

  // Dermatology - أمراض الجلد (10 records)
  { id: '16', city: 'حمص', ageGroup: '18-25', disease: 'حب الشباب', specialization: 'Dermatology', count: 89, date: '2024-01', severity: 'منخفض', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '17', city: 'اللاذقية', ageGroup: '26-35', disease: 'الصدفية', specialization: 'Dermatology', count: 45, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'علاج طبيعي' },
  { id: '18', city: 'دمشق', ageGroup: '36-45', disease: 'الإكزيما', specialization: 'Dermatology', count: 67, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '19', city: 'حلب', ageGroup: '18-25', disease: 'حب الشباب', specialization: 'Dermatology', count: 78, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '20', city: 'درعا', ageGroup: '46-55', disease: 'الصدفية', specialization: 'Dermatology', count: 34, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'علاج طبيعي' },
  { id: '21', city: 'حمص', ageGroup: '26-35', disease: 'البهاق', specialization: 'Dermatology', count: 23, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'علاج طبيعي' },
  { id: '22', city: 'اللاذقية', ageGroup: '36-45', disease: 'الإكزيما', specialization: 'Dermatology', count: 56, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '23', city: 'دمشق', ageGroup: '56+', disease: 'سرطان الجلد', specialization: 'Dermatology', count: 18, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'جراحة' },
  { id: '24', city: 'حلب', ageGroup: '0-17', disease: 'التهاب الجلد التماسي', specialization: 'Dermatology', count: 42, date: '2024-01', severity: 'منخفض', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '25', city: 'حمص', ageGroup: '18-25', disease: 'حب الشباب', specialization: 'Dermatology', count: 91, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'دوائي' },

  // Endocrinology - الغدد الصماء (12 records)
  { id: '26', city: 'دمشق', ageGroup: '36-45', disease: 'السكري النوع الثاني', specialization: 'Endocrinology', count: 156, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '27', city: 'حلب', ageGroup: '46-55', disease: 'قصور الغدة الدرقية', specialization: 'Endocrinology', count: 78, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '28', city: 'حمص', ageGroup: '26-35', disease: 'السكري النوع الأول', specialization: 'Endocrinology', count: 45, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '29', city: 'اللاذقية', ageGroup: '56+', disease: 'السكري النوع الثاني', specialization: 'Endocrinology', count: 89, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '30', city: 'درعا', ageGroup: '36-45', disease: 'قصور الغدة الدرقية', specialization: 'Endocrinology', count: 52, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '31', city: 'حماة', ageGroup: '46-55', disease: 'السكري النوع الثاني', specialization: 'Endocrinology', count: 67, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '32', city: 'دير الزور', ageGroup: '26-35', disease: 'فرط نشاط الغدة الدرقية', specialization: 'Endocrinology', count: 34, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '33', city: 'السويداء', ageGroup: '56+', disease: 'السكري النوع الثاني', specialization: 'Endocrinology', count: 78, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '34', city: 'القنيطرة', ageGroup: '36-45', disease: 'قصور الغدة الدرقية', specialization: 'Endocrinology', count: 29, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '35', city: 'طرطوس', ageGroup: '18-25', disease: 'السكري النوع الأول', specialization: 'Endocrinology', count: 23, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '36', city: 'إدلب', ageGroup: '46-55', disease: 'السكري النوع الثاني', specialization: 'Endocrinology', count: 56, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '37', city: 'الرقة', ageGroup: '36-45', disease: 'قصور الغدة الدرقية', specialization: 'Endocrinology', count: 41, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },

  // Gastroenterology - الجهاز الهضمي (10 records)
  { id: '38', city: 'درعا', ageGroup: '26-35', disease: 'قرحة المعدة', specialization: 'Gastroenterology', count: 34, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '39', city: 'حمص', ageGroup: '56+', disease: 'التهاب القولون', specialization: 'Gastroenterology', count: 56, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'مراقبة' },
  { id: '40', city: 'دمشق', ageGroup: '36-45', disease: 'ارتجاع المريء', specialization: 'Gastroenterology', count: 89, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '41', city: 'حلب', ageGroup: '46-55', disease: 'التهاب البنكرياس', specialization: 'Gastroenterology', count: 23, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'جراحة' },
  { id: '42', city: 'اللاذقية', ageGroup: '26-35', disease: 'القولون العصبي', specialization: 'Gastroenterology', count: 67, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'علاج طبيعي' },
  { id: '43', city: 'حمص', ageGroup: '18-25', disease: 'التهاب المعدة', specialization: 'Gastroenterology', count: 45, date: '2024-01', severity: 'منخفض', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '44', city: 'درعا', ageGroup: '56+', disease: 'حصى المرارة', specialization: 'Gastroenterology', count: 34, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'جراحة' },
  { id: '45', city: 'دمشق', ageGroup: '36-45', disease: 'التهاب الكبد الوبائي أ', specialization: 'Gastroenterology', count: 28, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'مراقبة' },
  { id: '46', city: 'حلب', ageGroup: '26-35', disease: 'قرحة المعدة', specialization: 'Gastroenterology', count: 39, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '47', city: 'اللاذقية', ageGroup: '46-55', disease: 'التهاب القولون', specialization: 'Gastroenterology', count: 52, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'مراقبة' },

  // Neurology - الأعصاب (10 records)
  { id: '48', city: 'دمشق', ageGroup: '56+', disease: 'الزهايمر', specialization: 'Neurology', count: 42, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'مراقبة' },
  { id: '49', city: 'حلب', ageGroup: '36-45', disease: 'الصداع النصفي', specialization: 'Neurology', count: 67, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '50', city: 'حمص', ageGroup: '26-35', disease: 'الصرع', specialization: 'Neurology', count: 34, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '51', city: 'اللاذقية', ageGroup: '46-55', disease: 'الزهايمر', specialization: 'Neurology', count: 29, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'مراقبة' },
  { id: '52', city: 'درعا', ageGroup: '18-25', disease: 'الصداع النصفي', specialization: 'Neurology', count: 56, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '53', city: 'دمشق', ageGroup: '36-45', disease: 'التصلب المتعدد', specialization: 'Neurology', count: 23, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '54', city: 'حلب', ageGroup: '56+', disease: 'الشلل الرعاش', specialization: 'Neurology', count: 31, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'مراقبة' },
  { id: '55', city: 'حمص', ageGroup: '26-35', disease: 'الصداع النصفي', specialization: 'Neurology', count: 48, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '56', city: 'اللاذقية', ageGroup: '46-55', disease: 'الصرع', specialization: 'Neurology', count: 27, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '57', city: 'درعا', ageGroup: '36-45', disease: 'الزهايمر', specialization: 'Neurology', count: 19, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'مراقبة' },

  // Pulmonology - الجهاز التنفسي (8 records)
  { id: '58', city: 'حمص', ageGroup: '18-25', disease: 'الربو', specialization: 'Pulmonology', count: 89, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '59', city: 'اللاذقية', ageGroup: '56+', disease: 'انسداد رئوي مزمن', specialization: 'Pulmonology', count: 45, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'علاج طبيعي' },
  { id: '60', city: 'دمشق', ageGroup: '36-45', disease: 'الربو', specialization: 'Pulmonology', count: 67, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '61', city: 'حلب', ageGroup: '26-35', disease: 'التهاب الشعب الهوائية', specialization: 'Pulmonology', count: 52, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '62', city: 'حمص', ageGroup: '56+', disease: 'الالتهاب الرئوي', specialization: 'Pulmonology', count: 38, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '63', city: 'اللاذقية', ageGroup: '18-25', disease: 'الربو', specialization: 'Pulmonology', count: 74, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '64', city: 'دمشق', ageGroup: '46-55', disease: 'انسداد رئوي مزمن', specialization: 'Pulmonology', count: 41, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'علاج طبيعي' },
  { id: '65', city: 'حلب', ageGroup: '36-45', disease: 'الربو', specialization: 'Pulmonology', count: 59, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },

  // Orthopedics - العظام (8 records)
  { id: '66', city: 'درعا', ageGroup: '46-55', disease: 'هشاشة العظام', specialization: 'Orthopedics', count: 78, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'علاج طبيعي' },
  { id: '67', city: 'دمشق', ageGroup: '26-35', disease: 'إصابة رياضية', specialization: 'Orthopedics', count: 34, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'علاج طبيعي' },
  { id: '68', city: 'حلب', ageGroup: '56+', disease: 'التهاب المفاصل', specialization: 'Orthopedics', count: 89, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'علاج طبيعي' },
  { id: '69', city: 'حمص', ageGroup: '36-45', disease: 'انزلاق غضروفي', specialization: 'Orthopedics', count: 45, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'جراحة' },
  { id: '70', city: 'اللاذقية', ageGroup: '18-25', disease: 'كسر في العظام', specialization: 'Orthopedics', count: 67, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'جراحة' },
  { id: '71', city: 'درعا', ageGroup: '46-55', disease: 'التهاب المفاصل', specialization: 'Orthopedics', count: 52, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'علاج طبيعي' },
  { id: '72', city: 'دمشق', ageGroup: '56+', disease: 'هشاشة العظام', specialization: 'Orthopedics', count: 91, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'علاج طبيعي' },
  { id: '73', city: 'حلب', ageGroup: '26-35', disease: 'إصابة رياضية', specialization: 'Orthopedics', count: 38, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'علاج طبيعي' },

  // Pediatrics - طب الأطفال (8 records)
  { id: '74', city: 'حلب', ageGroup: '0-17', disease: 'التهاب الأذن الوسطى', specialization: 'Pediatrics', count: 112, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '75', city: 'حمص', ageGroup: '0-17', disease: 'الحصبة', specialization: 'Pediatrics', count: 56, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '76', city: 'دمشق', ageGroup: '0-17', disease: 'الربو', specialization: 'Pediatrics', count: 78, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '77', city: 'اللاذقية', ageGroup: '0-17', disease: 'النزلة المعوية', specialization: 'Pediatrics', count: 89, date: '2024-01', severity: 'منخفض', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '78', city: 'درعا', ageGroup: '0-17', disease: 'التهاب الأذن الوسطى', specialization: 'Pediatrics', count: 67, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '79', city: 'حمص', ageGroup: '0-17', disease: 'الحصبة', specialization: 'Pediatrics', count: 45, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '80', city: 'حلب', ageGroup: '0-17', disease: 'الربو', specialization: 'Pediatrics', count: 92, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '81', city: 'دمشق', ageGroup: '0-17', disease: 'النزلة المعوية', specialization: 'Pediatrics', count: 74, date: '2024-01', severity: 'منخفض', gender: 'أنثى', treatmentType: 'دوائي' },

  // Ophthalmology - العيون (6 records)
  { id: '82', city: 'اللاذقية', ageGroup: '56+', disease: 'إعتام عدسة العين', specialization: 'Ophthalmology', count: 67, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'جراحة' },
  { id: '83', city: 'دمشق', ageGroup: '36-45', disease: 'جلوكوما', specialization: 'Ophthalmology', count: 23, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '84', city: 'حلب', ageGroup: '46-55', disease: 'إعتام عدسة العين', specialization: 'Ophthalmology', count: 45, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'جراحة' },
  { id: '85', city: 'حمص', ageGroup: '26-35', disease: 'التهاب الملتحمة', specialization: 'Ophthalmology', count: 89, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '86', city: 'اللاذقية', ageGroup: '56+', disease: 'جلوكوما', specialization: 'Ophthalmology', count: 34, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '87', city: 'دمشق', ageGroup: '36-45', disease: 'إعتام عدسة العين', specialization: 'Ophthalmology', count: 52, date: '2024-01', severity: 'متوسط', gender: 'ذكر', treatmentType: 'جراحة' },

  // Psychiatry - الطب النفسي (6 records)
  { id: '88', city: 'حلب', ageGroup: '26-35', disease: 'الاكتئاب', specialization: 'Psychiatry', count: 89, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '89', city: 'دمشق', ageGroup: '18-25', disease: 'قلق عام', specialization: 'Psychiatry', count: 67, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '90', city: 'حمص', ageGroup: '36-45', disease: 'الاكتئاب', specialization: 'Psychiatry', count: 56, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '91', city: 'اللاذقية', ageGroup: '26-35', disease: 'قلق عام', specialization: 'Psychiatry', count: 45, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '92', city: 'دمشق', ageGroup: '46-55', disease: 'الاكتئاب', specialization: 'Psychiatry', count: 38, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '93', city: 'حلب', ageGroup: '18-25', disease: 'قلق عام', specialization: 'Psychiatry', count: 72, date: '2024-01', severity: 'منخفض', gender: 'ذكر', treatmentType: 'دوائي' },

  // Additional specializations (7 records)
  { id: '94', city: 'حلب', ageGroup: '56+', disease: 'الروماتيزم', specialization: 'Rheumatology', count: 34, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '95', city: 'حمص', ageGroup: '36-45', disease: 'حصى الكلى', specialization: 'Urology', count: 56, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'جراحة' },
  { id: '96', city: 'اللاذقية', ageGroup: '26-35', disease: 'فقر الدم', specialization: 'Hematology', count: 78, date: '2024-01', severity: 'منخفض', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '97', city: 'درعا', ageGroup: '18-25', disease: 'التهاب الكبد الوبائي', specialization: 'InfectiousDisease', count: 23, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'مراقبة' },
  { id: '98', city: 'دمشق', ageGroup: '46-55', disease: 'سرطان الثدي', specialization: 'Oncology', count: 45, date: '2024-01', severity: 'عالي', gender: 'أنثى', treatmentType: 'جراحة' },
  { id: '99', city: 'حلب', ageGroup: '56+', disease: 'الفشل الكلوي', specialization: 'Nephrology', count: 34, date: '2024-01', severity: 'عالي', gender: 'ذكر', treatmentType: 'مراقبة' },
  { id: '100', city: 'حمص', ageGroup: '36-45', disease: 'التهاب المفاصل الروماتويدي', specialization: 'Rheumatology', count: 41, date: '2024-01', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },

  // December 2023 data for comparison (10 records)
  { id: '101', city: 'دمشق', ageGroup: '36-45', disease: 'ارتفاع ضغط الدم', specialization: 'Cardiology', count: 58, date: '2023-12', severity: 'عالي', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '102', city: 'حلب', ageGroup: '26-35', disease: 'السكري النوع الثاني', specialization: 'Endocrinology', count: 134, date: '2023-12', severity: 'عالي', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '103', city: 'حمص', ageGroup: '18-25', disease: 'حب الشباب', specialization: 'Dermatology', count: 76, date: '2023-12', severity: 'منخفض', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '104', city: 'اللاذقية', ageGroup: '56+', disease: 'قصور القلب', specialization: 'Cardiology', count: 29, date: '2023-12', severity: 'عالي', gender: 'ذكر', treatmentType: 'جراحة' },
  { id: '105', city: 'درعا', ageGroup: '36-45', disease: 'الربو', specialization: 'Pulmonology', count: 62, date: '2023-12', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '106', city: 'دمشق', ageGroup: '46-55', disease: 'هشاشة العظام', specialization: 'Orthopedics', count: 71, date: '2023-12', severity: 'متوسط', gender: 'أنثى', treatmentType: 'علاج طبيعي' },
  { id: '107', city: 'حلب', ageGroup: '0-17', disease: 'التهاب الأذن الوسطى', specialization: 'Pediatrics', count: 98, date: '2023-12', severity: 'منخفض', gender: 'ذكر', treatmentType: 'دوائي' },
  { id: '108', city: 'حمص', ageGroup: '26-35', disease: 'الاكتئاب', specialization: 'Psychiatry', count: 49, date: '2023-12', severity: 'متوسط', gender: 'أنثى', treatmentType: 'دوائي' },
  { id: '109', city: 'اللاذقية', ageGroup: '36-45', disease: 'إعتام عدسة العين', specialization: 'Ophthalmology', count: 41, date: '2023-12', severity: 'متوسط', gender: 'ذكر', treatmentType: 'جراحة' },
  { id: '110', city: 'دمشق', ageGroup: '56+', disease: 'الزهايمر', specialization: 'Neurology', count: 37, date: '2023-12', severity: 'عالي', gender: 'أنثى', treatmentType: 'مراقبة' },
]

export const CITIES = [
  { value: 'all', label: 'جميع المدن' },
  { value: 'دمشق', label: 'دمشق' },
  { value: 'حلب', label: 'حلب' },
  { value: 'حمص', label: 'حمص' },
  { value: 'اللاذقية', label: 'اللاذقية' },
  { value: 'درعا', label: 'درعا' },
  { value: 'حماة', label: 'حماة' },
  { value: 'دير الزور', label: 'دير الزور' },
  { value: 'السويداء', label: 'السويداء' },
  { value: 'القنيطرة', label: 'القنيطرة' },
  { value: 'طرطوس', label: 'طرطوس' },
  { value: 'إدلب', label: 'إدلب' },
  { value: 'الرقة', label: 'الرقة' },
]

export const AGE_GROUPS = [
  { value: 'all', label: 'جميع الفئات' },
  { value: '0-17', label: 'أطفال (0-17)' },
  { value: '18-25', label: 'شباب (18-25)' },
  { value: '26-35', label: 'بالغين شباب (26-35)' },
  { value: '36-45', label: 'وسط (36-45)' },
  { value: '46-55', label: 'كبار (46-55)' },
  { value: '56+', label: 'مسنين (56+)' },
]

export const DISEASES = [
  { value: 'all', label: 'جميع الأمراض' },
  { value: 'ارتفاع ضغط الدم', label: 'ارتفاع ضغط الدم' },
  { value: 'قصور القلب', label: 'قصور القلب' },
  { value: 'ذبحة صدرية', label: 'ذبحة صدرية' },
  { value: 'حب الشباب', label: 'حب الشباب' },
  { value: 'الصدفية', label: 'الصدفية' },
  { value: 'السكري النوع الثاني', label: 'السكري النوع الثاني' },
  { value: 'السكري النوع الأول', label: 'السكري النوع الأول' },
  { value: 'قصور الغدة الدرقية', label: 'قصور الغدة الدرقية' },
  { value: 'قرحة المعدة', label: 'قرحة المعدة' },
  { value: 'التهاب القولون', label: 'التهاب القولون' },
  { value: 'الزهايمر', label: 'الزهايمر' },
  { value: 'الصداع النصفي', label: 'الصداع النصفي' },
  { value: 'الربو', label: 'الربو' },
  { value: 'انسداد رئوي مزمن', label: 'انسداد رئوي مزمن' },
  { value: 'هشاشة العظام', label: 'هشاشة العظام' },
  { value: 'إصابة رياضية', label: 'إصابة رياضية' },
  { value: 'التهاب الأذن الوسطى', label: 'التهاب الأذن الوسطى' },
  { value: 'الحصبة', label: 'الحصبة' },
  { value: 'إعتام عدسة العين', label: 'إعتام عدسة العين' },
  { value: 'جلوكوما', label: 'جلوكوما' },
  { value: 'الاكتئاب', label: 'الاكتئاب' },
  { value: 'قلق عام', label: 'قلق عام' },
  { value: 'الروماتيزم', label: 'الروماتيزم' },
  { value: 'حصى الكلى', label: 'حصى الكلى' },
  { value: 'فقر الدم', label: 'فقر الدم' },
  { value: 'التهاب الكبد الوبائي', label: 'التهاب الكبد الوبائي' },
  { value: 'سرطان الثدي', label: 'سرطان الثدي' },
  { value: 'الفشل الكلوي', label: 'الفشل الكلوي' },
]

export const SPECIALIZATIONS = [
  { value: 'all', label: 'جميع التخصصات' },
  { value: 'Cardiology', label: 'أمراض القلب' },
  { value: 'Dermatology', label: 'الأمراض الجلدية' },
  { value: 'Endocrinology', label: 'الغدد الصماء' },
  { value: 'Gastroenterology', label: 'الجهاز الهضمي' },
  { value: 'Hematology', label: 'أمراض الدم' },
  { value: 'InfectiousDisease', label: 'الأمراض المعدية' },
  { value: 'Nephrology', label: 'أمراض الكلى' },
  { value: 'Neurology', label: 'الأمراض العصبية' },
  { value: 'Oncology', label: 'الأورام' },
  { value: 'Pediatrics', label: 'طب الأطفال' },
  { value: 'Psychiatry', label: 'الطب النفسي' },
  { value: 'Pulmonology', label: 'أمراض الرئة' },
  { value: 'Rheumatology', label: 'الروماتيزم' },
  { value: 'Surgery', label: 'الجراحة' },
  { value: 'Urology', label: 'مسالك بولية' },
  { value: 'Ophthalmology', label: 'العيون' },
  { value: 'Orthopedics', label: 'العظام' },
  { value: 'Anesthesiology', label: 'التخدير' },
  { value: 'Radiology', label: 'الأشعة' },
  { value: 'EmergencyMedicine', label: 'الطوارئ' },
  { value: 'FamilyMedicine', label: 'طب الأسرة' },
  { value: 'InternalMedicine', label: 'الباطنية' },
  { value: 'ObstetricsGynecology', label: 'نساء وتوليد' },
  { value: 'Pathology', label: 'الباثولوجيا' },
  { value: 'PhysicalMedicine', label: 'الطب الطبيعي' },
]

export const SEVERITY_LEVELS = [
  { value: 'all', label: 'جميع المستويات' },
  { value: 'منخفض', label: 'منخفض' },
  { value: 'متوسط', label: 'متوسط' },
  { value: 'عالي', label: 'عالي' },
]

export const GENDERS = [
  { value: 'all', label: 'جميع الجنسين' },
  { value: 'ذكر', label: 'ذكر' },
  { value: 'أنثى', label: 'أنثى' },
]

export const TREATMENT_TYPES = [
  { value: 'دوائي', label: 'علاج دوائي' },
  { value: 'جراحة', label: 'تدخل جراحي' },
  { value: 'علاج طبيعي', label: 'علاج طبيعي' },
  { value: 'مراقبة', label: 'مراقبة ومتابعة' },
]

export const DATE_RANGES = [
  { value: 'all', label: 'جميع الفترات' },
  { value: '2024-01', label: 'يناير 2024' },
  { value: '2023-12', label: 'ديسمبر 2023' },
  { value: '2023-11', label: 'نوفمبر 2023' },
  { value: '2023-10', label: 'أكتوبر 2023' },
]

export const CHART_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#8DD1E1', '#D084C9', '#F95F62',
  '#A4DE6C', '#D0ED57', '#FFA500', '#87CEEB', '#DA70D6',
  '#32CD32', '#BA55D3', '#9370DB', '#3CB371', '#B22222'
]