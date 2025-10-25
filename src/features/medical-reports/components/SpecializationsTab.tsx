import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ChartData, SpecializationStats } from '../types/medical'
import { CHART_COLORS } from '../constants/data'

interface SpecializationsTabProps {
    specializationData: ChartData[]
    specializationStats?: SpecializationStats[]
  }

export const SpecializationsTab: React.FC<SpecializationsTabProps> = ({ specializationData }) => {
  const totalCases = specializationData.reduce((sum, spec) => sum + spec.value, 0)
  
  // Sort by value descending for better visualization
  const sortedData = [...specializationData].sort((a, b) => b.value - a.value)

  const getSpecializationLabel = (name: string) => {
    const labels: { [key: string]: string } = {
      'Cardiology': 'أمراض القلب',
      'Dermatology': 'الأمراض الجلدية',
      'Endocrinology': 'الغدد الصماء',
      'Gastroenterology': 'الجهاز الهضمي',
      'Hematology': 'أمراض الدم',
      'InfectiousDisease': 'الأمراض المعدية',
      'Nephrology': 'أمراض الكلى',
      'Neurology': 'الأمراض العصبية',
      'Oncology': 'الأورام',
      'Pediatrics': 'طب الأطفال',
      'Psychiatry': 'الطب النفسي',
      'Pulmonology': 'أمراض الرئة',
      'Rheumatology': 'الروماتيزم',
      'Surgery': 'الجراحة',
      'Urology': 'مسالك بولية',
      'Ophthalmology': 'العيون',
      'Orthopedics': 'العظام',
      'Anesthesiology': 'التخدير',
      'Radiology': 'الأشعة',
      'EmergencyMedicine': 'الطوارئ',
      'FamilyMedicine': 'طب الأسرة',
      'InternalMedicine': 'الباطنية',
      'ObstetricsGynecology': 'نساء وتوليد',
      'Pathology': 'الباثولوجيا',
      'PhysicalMedicine': 'الطب الطبيعي'
    }
    return labels[name] || name
  }

  const chartData = sortedData.map(item => ({
    ...item,
    label: getSpecializationLabel(item.name)
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التخصصات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{specializationData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أعلى تخصص</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {sortedData.length > 0 ? getSpecializationLabel(sortedData[0].name) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {sortedData.length > 0 ? `${sortedData[0].value} حالة` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الحالات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalCases / specializationData.length)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحالات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCases}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>التوزيع حسب التخصص</CardTitle>
            <p className="text-sm text-muted-foreground">
              عدد الحالات في كل تخصص طبي
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.slice(0, 10)} // Show top 10 only
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="label" 
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} حالة`, 'عدد الحالات']}
                    labelFormatter={(label) => `التخصص: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="عدد الحالات"
                    fill="#8884D8" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>النسبة المئوية للتخصصات</CardTitle>
            <p className="text-sm text-muted-foreground">
              التوزيع النسبي للحالات عبر التخصصات
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.slice(0, 8)} // Show top 8 in pie chart
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ label, percent }) => 
                      `${label} (${(percent as number * 100).toFixed(1)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.slice(0, 8).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [
                      `${value} حالة (${((value / totalCases) * 100).toFixed(1)}%)`,
                      'عدد الحالات'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة كاملة بالتخصصات</CardTitle>
          <p className="text-sm text-muted-foreground">
            جميع التخصصات الطبية مرتبة حسب عدد الحالات
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chartData.map((specialization, index) => (
              <div key={specialization.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border">
                    <span className="text-sm font-bold text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      {specialization.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {specialization.name}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-xl text-blue-600">
                    {specialization.value} حالة
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {((specialization.value / totalCases) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-blue-900">الإجمالي العام</h3>
                <p className="text-sm text-blue-700">
                  {specializationData.length} تخصص طبي
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">
                  {totalCases} حالة
                </div>
                <div className="text-sm text-blue-700">
                  جميع التخصصات الطبية
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}