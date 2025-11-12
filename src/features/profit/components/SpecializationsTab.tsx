"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { ChartData, SpecializationStats } from '../types/appointment'
import { CHART_COLORS } from '../constants/appointment'
import { Stethoscope, Users, DollarSign, TrendingUp, Award, BarChart3 } from 'lucide-react'

interface SpecializationsTabProps {
  specializationData: ChartData[]
  specializationStats?: SpecializationStats[]
}

export const SpecializationsTab: React.FC<SpecializationsTabProps> = ({ specializationData, specializationStats = [] }) => {
  const totalAppointments = specializationData.reduce((sum, spec) => sum + spec.value, 0)
  const totalRevenue = specializationStats.reduce((sum, spec) => sum + spec.totalRevenue, 0)
  
  // Sort by appointments descending
  const sortedData = [...specializationData].sort((a, b) => b.value - a.value)
  const sortedStats = [...specializationStats].sort((a, b) => b.totalAppointments - a.totalAppointments)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getSpecializationLabel = (name: string) => {
    const labels: { [key: string]: string } = {
      'Cardiology': 'أمراض القلب',
      'Dermatology': 'الأمراض الجلدية',
      'Endocrinology': 'الغدد الصماء',
      'Gastroenterology': 'الجهاز الهضمي',
      'Neurology': 'الأمراض العصبية',
      'Pulmonology': 'أمراض الرئة',
      'Orthopedics': 'العظام',
      'Pediatrics': 'طب الأطفال',
      'Ophthalmology': 'العيون',
      'Psychiatry': 'الطب النفسي',
      'Surgery': 'الجراحة',
      'Urology': 'مسالك بولية',
      'Oncology': 'الأورام'
    }
    return labels[name] || name
  }

  const chartData = sortedData.map(item => ({
    name: getSpecializationLabel(item.name),
    مواعيد: item.value,
    label: getSpecializationLabel(item.name)
  }))

  const revenueData = sortedStats.map(spec => ({
    subject: getSpecializationLabel(spec.specialization),
    إيرادات: spec.totalRevenue / 1000, // تقسيم على 1000 للتنسيق
    مواعيد: spec.totalAppointments,
    fullMark: 100
  }))

  const feeComparisonData = sortedStats.map(spec => ({
    name: getSpecializationLabel(spec.specialization),
    'متوسط الكشف': spec.averageFee
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">إجمالي المواعيد</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalAppointments}</div>
            <p className="text-xs text-blue-600 mt-1">جميع التخصصات</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">أعلى تخصص</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-900 truncate">
              {sortedData.length > 0 ? getSpecializationLabel(sortedData[0].name) : '-'}
            </div>
            <p className="text-xs text-green-600">
              {sortedData.length > 0 ? `${sortedData[0].value} موعد` : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">عدد التخصصات</CardTitle>
            <Stethoscope className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{specializationData.length}</div>
            <p className="text-xs text-orange-600">تخصص طبي</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">متوسط الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(totalRevenue / specializationData.length)}
            </div>
            <p className="text-xs text-purple-600">لكل تخصص</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Appointments by Specialization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">المواعيد حسب التخصص</CardTitle>
            <p className="text-sm text-muted-foreground">
              توزيع عدد المواعيد عبر التخصصات الطبية
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="مواعيد" 
                    name="عدد المواعيد"
                    fill="#0088FE" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Specialization Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">التوزيع النسبي للتخصصات</CardTitle>
            <p className="text-sm text-muted-foreground">
              النسبة المئوية للمواعيد في كل تخصص
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => 
                      `${name} (${(percent as number * 100).toFixed(1)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="مواعيد"
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
                      `${value} موعد (${((value / totalAppointments) * 100).toFixed(1)}%)`,
                      'عدد المواعيد'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">تحليل الإيرادات بالتخصص</CardTitle>
          <p className="text-sm text-muted-foreground">
            مقارنة أداء التخصصات من حيث الإيرادات والمواعيد
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={revenueData.slice(0, 8)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="الإيرادات (ألف)"
                  dataKey="إيرادات"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Radar
                  name="المواعيد"
                  dataKey="مواعيد"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'الإيرادات (ألف)' ? `${value} ألف` : value,
                    name
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Fee Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">مقارنة متوسط أسعار الكشوف</CardTitle>
          <p className="text-sm text-muted-foreground">
            متوسط قيمة الكشف في كل تخصص طبي
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={feeComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={formatCurrency} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'متوسط الكشف']} />
                <Legend />
                <Bar 
                  dataKey="متوسط الكشف" 
                  name="متوسط قيمة الكشف"
                  fill="#FF8042" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Specialization Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">تحليل مفصل للتخصصات</CardTitle>
          <p className="text-sm text-muted-foreground">
            إحصائيات شاملة لكل تخصص طبي
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedStats.map((specialization, index) => (
              <div key={specialization.specialization} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-900">
                      {getSpecializationLabel(specialization.specialization)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {specialization.uniqueDoctors} طبيب • {specialization.completionRate.toFixed(1)}% إنجاز
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex gap-6 items-center">
                    <div>
                      <div className="font-bold text-lg text-green-600">
                        {specialization.totalAppointments}
                      </div>
                      <div className="text-sm text-gray-600">إجمالي المواعيد</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-blue-600">
                        {formatCurrency(specialization.totalRevenue)}
                      </div>
                      <div className="text-sm text-gray-600">الإيرادات</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-purple-600">
                        {formatCurrency(specialization.averageFee)}
                      </div>
                      <div className="text-sm text-gray-600">متوسط الكشف</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-orange-600">
                        {specialization.uniqueDoctors}
                      </div>
                      <div className="text-sm text-gray-600">عدد الأطباء</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h3 className="font-semibold text-blue-900">أعلى تخصص</h3>
                <p className="text-xl font-bold text-blue-700">
                  {sortedStats.length > 0 ? getSpecializationLabel(sortedStats[0].specialization) : '-'}
                </p>
                <p className="text-sm text-blue-600">
                  {sortedStats.length > 0 ? `${sortedStats[0].totalAppointments} موعد` : ''}
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-green-900">أعلى إيرادات</h3>
                <p className="text-xl font-bold text-green-700">
                  {sortedStats.length > 0 ? getSpecializationLabel(sortedStats.reduce((max, spec) => spec.totalRevenue > max.totalRevenue ? spec : max).specialization) : '-'}
                </p>
                <p className="text-sm text-green-600">
                  {sortedStats.length > 0 ? formatCurrency(sortedStats.reduce((max, spec) => spec.totalRevenue > max.totalRevenue ? spec : max).totalRevenue) : ''}
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-purple-900">متوسط الكشف</h3>
                <p className="text-xl font-bold text-purple-700">
                  {formatCurrency(sortedStats.reduce((sum, spec) => sum + spec.averageFee, 0) / sortedStats.length)}
                </p>
                <p className="text-sm text-purple-600">لجميع التخصصات</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}