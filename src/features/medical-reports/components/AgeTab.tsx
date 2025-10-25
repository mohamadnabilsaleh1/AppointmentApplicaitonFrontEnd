import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { ChartData } from '../types/medical'

interface AgeTabProps {
  ageGroupData: ChartData[]
}

export const AgeTab: React.FC<AgeTabProps> = ({ ageGroupData }) => {
  // Sort age groups logically
  const sortedAgeData = [...ageGroupData].sort((a, b) => {
    const order = ['18-25', '26-35', '36-45', '46-55', '56+']
    return order.indexOf(a.name) - order.indexOf(b.name)
  })

  // Transform data for Recharts compatibility
  const chartData = sortedAgeData.map(item => ({
    name: item.name,
    value: item.value
  }))

  const totalCases = sortedAgeData.reduce((sum, age) => sum + age.value, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>التقارير حسب الفئة العمرية</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            تحليل توزيع الحالات عبر الفئات العمرية المختلفة
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} حالة`, 'عدد الحالات']}
                  labelFormatter={(label) => `الفئة العمرية: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="عدد الحالات"
                  fill="#FF8042" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الاتجاه العمري</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} حالة`, 'عدد الحالات']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="عدد الحالات"
                    stroke="#FF8042" 
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تحليل الفئات العمرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedAgeData.map((ageGroup, index) => (
                <div key={ageGroup.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{ageGroup.name}</span>
                    <span className="font-bold">
                      {ageGroup.value} حالة ({(ageGroup.value / totalCases * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${(ageGroup.value / totalCases) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>متوسط الحالات لكل فئة</span>
                  <span>
                    {Math.round(totalCases / sortedAgeData.length)} حالة
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>الفئة الأعلى</span>
                  <span>
                    {sortedAgeData.length > 0 
                      ? sortedAgeData.reduce((max, age) => age.value > max.value ? age : max).name
                      : '-'
                    }
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}