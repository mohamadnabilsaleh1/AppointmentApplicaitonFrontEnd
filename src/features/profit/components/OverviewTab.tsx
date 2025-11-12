"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { StatsCards } from './StatsCards'
import { AggregatedData } from '../types/appointment'
import { CHART_COLORS } from '../constants/appointment'

interface OverviewTabProps {
  aggregatedData: AggregatedData
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ aggregatedData }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 0
    }).format(value)
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

  const specializationChartData = aggregatedData.specializationData.map(item => ({
    name: getSpecializationLabel(item.name),
    مواعيد: item.value,
    revenue: aggregatedData.specializationData.find(s => s.name === item.name)?.value || 0
  }))

  const statusChartData = aggregatedData.statusData.map(item => ({
    name: item.name,
    عدد: item.value
  }))

  const monthlyData = [
    { name: 'ديسمبر', مواعيد: 45, إيرادات: 1850000 },
    { name: 'يناير', مواعيد: 62, إيرادات: 2540000 },
    { name: 'فبراير', مواعيد: 38, إيرادات: 1680000 },
  ]

  return (
    <div className="space-y-6">
      <StatsCards {...aggregatedData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">المواعيد حسب التخصص</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={specializationChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="مواعيد" fill="#0088FE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">توزيع حالات المواعيد</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent as number * 100).toFixed(1)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="عدد"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">الاتجاه الشهري للمواعيد والإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" tickFormatter={formatCurrency} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'إيرادات' ? formatCurrency(Number(value)) : value,
                    name
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="مواعيد" 
                  name="عدد المواعيد"
                  stroke="#0088FE" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="إيرادات" 
                  name="الإيرادات"
                  stroke="#00C49F" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">المواعيد حسب المستشفى</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={aggregatedData.hospitalData}
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
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="عدد المواعيد"
                  fill="#FF8042" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">المواعيد حسب المدينة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={aggregatedData.cityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent as number * 100).toFixed(1)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {aggregatedData.cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}