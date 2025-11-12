"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { ChartData, DoctorStats } from '../types/appointment'
import { CHART_COLORS } from '../constants/appointment'
import { User, Calendar, DollarSign, TrendingUp, Clock, Award, Star } from 'lucide-react'

interface DoctorsTabProps {
  doctorData: ChartData[]
  doctorStats?: DoctorStats[]
}

export const DoctorsTab: React.FC<DoctorsTabProps> = ({ doctorData, doctorStats = [] }) => {
  const totalAppointments = doctorData.reduce((sum, doctor) => sum + doctor.value, 0)
  const totalRevenue = doctorStats.reduce((sum, doctor) => sum + doctor.totalRevenue, 0)
  
  // Sort by appointments descending
  const sortedData = [...doctorData].sort((a, b) => b.value - a.value)
  const sortedStats = [...doctorStats].sort((a, b) => b.totalAppointments - a.totalAppointments)
  const topDoctors = sortedStats.slice(0, 5)

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
      'Psychiatry': 'الطب النفسي'
    }
    return labels[name] || name
  }

  const doctorPerformanceData = topDoctors.map(doctor => ({
    name: doctor.doctorName,
    مواعيد: doctor.totalAppointments,
    إيرادات: doctor.totalRevenue,
    'معدل الإنجاز': doctor.completionRate
  }))

  const revenueChartData = sortedStats.slice(0, 8).map(doctor => ({
    name: doctor.doctorName,
    إيرادات: doctor.totalRevenue
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">إجمالي المواعيد</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalAppointments}</div>
            <p className="text-xs text-blue-600 mt-1">جميع الأطباء</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-green-600 mt-1">لجميع الأطباء</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">عدد الأطباء</CardTitle>
            <User className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{doctorData.length}</div>
            <p className="text-xs text-orange-600">طبيب نشط</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">متوسط المواعيد</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {Math.round(totalAppointments / doctorData.length)}
            </div>
            <p className="text-xs text-purple-600">لكل طبيب</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Doctors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Award className="h-5 w-5 text-yellow-500" />
            أفضل الأطباء أداءً
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            تصنيف الأطباء حسب عدد المواعيد والإيرادات
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topDoctors.map((doctor, index) => (
              <div key={doctor.doctorName} className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-900">
                        {doctor.doctorName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getSpecializationLabel(doctor.specialization)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المواعيد</span>
                    <span className="font-bold text-blue-600">{doctor.totalAppointments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">الإيرادات</span>
                    <span className="font-bold text-green-600">{formatCurrency(doctor.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">معدل الإنجاز</span>
                    <span className="font-bold text-purple-600">{doctor.completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">متوسط الكشف</span>
                    <span className="font-bold text-orange-600">{formatCurrency(doctor.averageFee)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Appointments by Doctor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">توزيع المواعيد حسب الطبيب</CardTitle>
            <p className="text-sm text-muted-foreground">
              عدد المواعيد لكل طبيب
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedData.slice(0, 8)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} موعد`, 'عدد المواعيد']}
                    labelFormatter={(label) => `الطبيب: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="عدد المواعيد"
                    fill="#0088FE" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Doctor Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">التوزيع النسبي للأطباء</CardTitle>
            <p className="text-sm text-muted-foreground">
              النسبة المئوية للمواعيد لكل طبيب
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sortedData.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => 
                      `${name} (${(percent as number * 100).toFixed(1)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sortedData.slice(0, 6).map((entry, index) => (
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

      {/* Revenue Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">تحليل الإيرادات حسب الطبيب</CardTitle>
          <p className="text-sm text-muted-foreground">
            مقارنة الإيرادات بين الأطباء
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueChartData}
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
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'الإيرادات']}
                />
                <Legend />
                <Bar 
                  dataKey="إيرادات" 
                  name="الإيرادات"
                  fill="#00C49F" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">مقاييس أداء الأطباء</CardTitle>
          <p className="text-sm text-muted-foreground">
            تحليل شامل لأداء جميع الأطباء
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedStats.map((doctor, index) => (
              <div key={doctor.doctorName} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-900">
                      {doctor.doctorName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getSpecializationLabel(doctor.specialization)} - {doctor.hospital}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex gap-6 items-center">
                    <div>
                      <div className="font-bold text-lg text-green-600">
                        {doctor.totalAppointments}
                      </div>
                      <div className="text-sm text-gray-600">إجمالي المواعيد</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-blue-600">
                        {formatCurrency(doctor.totalRevenue)}
                      </div>
                      <div className="text-sm text-gray-600">الإيرادات</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-purple-600">
                        {doctor.completionRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">معدل الإنجاز</div>
                    </div>
                    <div>
                      <div className={`font-bold text-lg ${doctor.cancellationRate > 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {doctor.cancellationRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">معدل الإلغاء</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-orange-600">
                        {Math.round(doctor.averageDuration)} د
                      </div>
                      <div className="text-sm text-gray-600">متوسط المدة</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-blue-900">ملخص أداء الأطباء</h3>
                <p className="text-sm text-blue-700">
                  {doctorData.length} طبيب نشط في النظام
                </p>
              </div>
              <div className="text-right space-y-2">
                <div className="text-2xl font-bold text-green-900">
                  {totalAppointments} موعد
                </div>
                <div className="text-sm text-blue-700">
                  إجمالي المواعيد لجميع الأطباء
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}