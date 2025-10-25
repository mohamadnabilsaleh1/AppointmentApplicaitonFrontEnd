"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartData } from '../types/medical'

interface CitiesTabProps {
  cityData: ChartData[]
}

export const CitiesTab: React.FC<CitiesTabProps> = ({ cityData }) => {
  // Transform data for Recharts compatibility
  const chartData = cityData.map(item => ({
    name: item.name,
    value: item.value
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>التقارير حسب المدينة</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          توزيع الحالات الطبية عبر مختلف المدن السورية
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`${value} حالة`, 'عدد الحالات']}
                labelFormatter={(label) => `المدينة: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="عدد الحالات"
                fill="#0088FE" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-blue-900">المدينة الأعلى</h3>
            <p className="text-2xl font-bold text-blue-700">
              {cityData.length > 0 
                ? cityData.reduce((max, city) => city.value > max.value ? city : max).name
                : '-'
              }
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-green-900">المتوسط الحسابي</h3>
            <p className="text-2xl font-bold text-green-700">
              {cityData.length > 0 
                ? Math.round(cityData.reduce((sum, city) => sum + city.value, 0) / cityData.length)
                : 0
              }
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-purple-900">إجمالي المدن</h3>
            <p className="text-2xl font-bold text-purple-700">
              {cityData.length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}