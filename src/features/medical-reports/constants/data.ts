import { MedicalReport } from '../types/medical'

export const MEDICAL_DATA: MedicalReport[] = [
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