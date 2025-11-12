"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar } from 'recharts'
import { ChartData } from '../types/appointment'
import { CHART_COLORS } from '../constants/appointment'
import { CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, DollarSign, Calendar } from 'lucide-react'

interface StatusTabProps {
  statusData: ChartData[]
  paymentData: ChartData[]
  appointmentTypeData: ChartData[]
}

export const StatusTab: React.FC<StatusTabProps> = ({ statusData, paymentData, appointmentTypeData }) => {
  const totalAppointments = statusData.reduce((sum, status) => sum + status.value, 0)
  const completedAppointments = statusData.find(s => s.name === 'مكتمل')?.value || 0
  const cancelledAppointments = statusData.find(s => s.name === 'ملغي')?.value || 0
  const pendingAppointments = statusData.find(s => s.name === 'قيد الانتظار')?.value || 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'مكتمل': '#00C49F',
      'ملغي': '#FF8042',
      'مؤجل': '#FFBB28',
      'قيد الانتظار': '#0088FE'
    }
    return colors[status] || '#8884D8'
  }

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'مكتمل': <CheckCircle className="h-5 w-5 text-green-500" />,
      'ملغي': <XCircle className="h-5 w-5 text-red-500" />,
      'مؤجل': <Clock className="h-5 w-5 text-orange-500" />,
      'قيد الانتظار': <AlertCircle className="h-5 w-5 text-blue-500" />
    }
    return icons[status] || <Calendar className="h-5 w-5 text-gray-500" />
  }

  const statusAnalysisData = statusData.map(status => ({
    name: status.name,
    value: status.value,
    percentage: (status.value / totalAppointments) * 100,
    color: getStatusColor(status.name),
    revenue: status.name === 'مكتمل' ? status.value * 45000 : 0
  }))

  const paymentAnalysisData = paymentData.map(payment => ({
    name: payment.name,
    value: payment.value,
    percentage: (payment.value / totalAppointments) * 100,
    color: payment.name === 'مدفوع' ? '#00C49F' : payment.name === 'جزئي' ? '#FFBB28' : '#FF8042'
  }))

  const monthlyStatusTrend = [
    { name: 'ديسمبر', مكتمل: 35, ملغي: 5, 'قيد الانتظار': 8 },
    { name: 'يناير', مكتمل: 48, ملغي: 7, 'قيد الانتظار': 12 },
    { name: 'فبراير', مكتمل: 42, ملغي: 6, 'قيد الانتظار': 10 },
  ]

  const efficiencyData = [
    { name: 'معدل الإنجاز', value: (completedAppointments / totalAppointments) * 100, fill: '#00C49F' },
    { name: 'معدل الإلغاء', value: (cancelledAppointments / totalAppointments) * 100, fill: '#FF8042' },
    { name: 'قيد المعالجة', value: (pendingAppointments / totalAppointments) * 100, fill: '#0088FE' }
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">مكتملة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{completedAppointments}</div>
            <p className="text-xs text-green-600 mt-1">
              {((completedAppointments / totalAppointments) * 100).toFixed(1)}% من الإجمالي
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">ملغية</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{cancelledAppointments}</div>
            <p className="text-xs text-red-600 mt-1">
              {((cancelledAppointments / totalAppointments) * 100).toFixed(1)}% من الإجمالي
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">قيد الانتظار</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{pendingAppointments}</div>
            <p className="text-xs text-blue-600 mt-1">
              {((pendingAppointments / totalAppointments) * 100).toFixed(1)}% من الإجمالي
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">معدل الإنجاز</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {((completedAppointments / totalAppointments) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-purple-600 mt-1">نسبة النجاح</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">توزيع حالات المواعيد</CardTitle>
            <p className="text-sm text-muted-foreground">
              النسبة المئوية لكل حالة من إجمالي المواعيد
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusAnalysisData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => 
                      `${name} (${percentage.toFixed(1)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusAnalysisData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [
                      `${value} موعد (${props.payload.percentage.toFixed(1)}%)`,
                      'عدد المواعيد'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">حالات الدفع</CardTitle>
            <p className="text-sm text-muted-foreground">
              توزيع حالات السداد للمواعيد
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentAnalysisData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => 
                      `${name} (${percentage.toFixed(1)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentAnalysisData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [
                      `${value} موعد (${props.payload.percentage.toFixed(1)}%)`,
                      'عدد المواعيد'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">مقاييس الكفاءة</CardTitle>
          <p className="text-sm text-muted-foreground">
            تحليل أداء النظام من حيث الإنجاز والإلغاء
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="10%" 
                outerRadius="80%" 
                data={efficiencyData} 
                startAngle={180} 
                endAngle={0}
              >
                <RadialBar 
                  minAngle={15} 
                  label={{ fill: '#666', position: 'insideStart' }} 
                  background 
                  clockWise 
                  dataKey="value" 
                />
                <Legend 
                  iconSize={10} 
                  layout="vertical" 
                  verticalAlign="middle" 
                  wrapperStyle={{ right: 0 }}
                />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, 'النسبة']}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Status Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">الاتجاه الشهري للحالات</CardTitle>
          <p className="text-sm text-muted-foreground">
            تطور حالات المواعيد على مدار الأشهر
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyStatusTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="مكتمل" 
                  name="مكتمل"
                  stroke="#00C49F" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ملغي" 
                  name="ملغي"
                  stroke="#FF8042" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="قيد الانتظار" 
                  name="قيد الانتظار"
                  stroke="#0088FE" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Status Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">تحليل مفصل للحالات</CardTitle>
          <p className="text-sm text-muted-foreground">
            إحصائيات مفصلة لكل حالة مع مؤشرات الأداء
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Status Analysis */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-4">تحليل حالات المواعيد</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statusAnalysisData.map((status) => (
                  <div key={status.name} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status.name)}
                        <span className="font-semibold text-gray-900">{status.name}</span>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: status.color }}>
                        {status.value}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${status.percentage}%`,
                          backgroundColor: status.color
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">النسبة</span>
                      <span className="text-sm font-semibold" style={{ color: status.color }}>
                        {status.percentage.toFixed(1)}%
                      </span>
                    </div>
                    {status.revenue > 0 && (
                      <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                        <div className="text-sm text-green-800 font-semibold">
                          {formatCurrency(status.revenue)}
                        </div>
                        <div className="text-xs text-green-600">إيرادات محققة</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Analysis */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-4">تحليل حالات الدفع</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentAnalysisData.map((payment) => (
                  <div key={payment.name} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" style={{ color: payment.color }} />
                        <span className="font-semibold text-gray-900">{payment.name}</span>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: payment.color }}>
                        {payment.value}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${payment.percentage}%`,
                          backgroundColor: payment.color
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">النسبة</span>
                      <span className="text-sm font-semibold" style={{ color: payment.color }}>
                        {payment.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment Types */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-4">أنواع المواعيد</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {appointmentTypeData.map((type, index) => (
                  <div key={type.name} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span className="font-semibold text-gray-900">{type.name}</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {type.value}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(type.value / totalAppointments) * 100}%`,
                          backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">النسبة</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {((type.value / totalAppointments) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold text-blue-900">معدل الإنجاز</h3>
                <div className="text-3xl font-bold text-green-600 mt-2">
                  {((completedAppointments / totalAppointments) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-blue-700 mt-1">نسبة المواعيد المكتملة</p>
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-blue-900">معدل الإلغاء</h3>
                <div className="text-3xl font-bold text-red-600 mt-2">
                  {((cancelledAppointments / totalAppointments) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-blue-700 mt-1">نسبة المواعيد الملغاة</p>
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-blue-900">السداد الكامل</h3>
                <div className="text-3xl font-bold text-purple-600 mt-2">
                  {((paymentData.find(p => p.name === 'مدفوع')?.value || 0) / totalAppointments * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-blue-700 mt-1">نسبة السداد الكامل</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}