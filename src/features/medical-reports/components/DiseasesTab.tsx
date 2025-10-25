import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ChartData } from '../types/medical'
import { CHART_COLORS } from '../constants/data'

interface DiseasesTabProps {
  diseaseData: ChartData[]
}

export const DiseasesTab: React.FC<DiseasesTabProps> = ({ diseaseData }) => {
  const totalCases = diseaseData.reduce((sum, disease) => sum + disease.value, 0)
  
  // Transform data for Recharts compatibility
  const chartData = diseaseData.map(item => ({
    name: item.name,
    value: item.value
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>التقارير حسب المرض</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            تحليل انتشار الأمراض المختلفة في البيانات
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
                  labelFormatter={(label) => `المرض: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="عدد الحالات"
                  fill="#00C49F" 
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
            <CardTitle>التوزيع النسبي للأمراض</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => 
                      `${name} (${(percent as number * 100).toFixed(1)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
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

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات الأمراض</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diseaseData.map((disease, index) => (
                <div key={disease.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="font-medium">{disease.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{disease.value} حالة</div>
                    <div className="text-sm text-muted-foreground">
                      {((disease.value / totalCases) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-bold">
                  <span>الإجمالي</span>
                  <span>{totalCases} حالة</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}