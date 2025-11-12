"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area } from 'recharts'
import { ChartData } from '../types/appointment'
import { CHART_COLORS } from '../constants/appointment'
import { MapPin, Users, DollarSign, TrendingUp, Building2, Navigation } from 'lucide-react'

interface CitiesTabProps {
  cityData: ChartData[]
}

export const CitiesTab: React.FC<CitiesTabProps> = ({ cityData }) => {
  const totalAppointments = cityData.reduce((sum, city) => sum + city.value, 0)
  
  // Sort by appointments descending
  const sortedData = [...cityData].sort((a, b) => b.value - a.value)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // بيانات افتراضية للإيرادات والنمو
  const cityAnalysisData = sortedData.map((city, index) => ({
    name: city.name,
    مواعيد: city.value,
    إيرادات: city.value * 42000, // متوسط افتراضي
    نمو: (0.4 * 25 + 5), // نمو افتراضي
    كفاءة: (0.2 * 20 + 80) // كفاءة افتراضية
  }))

  const regionalDistributionData = [
    { name: 'شمال', مدن: 3, مواعيد: 145, نسبة: 32 },
    { name: 'جنوب', مدن: 2, مواعيد: 98, نسبة: 22 },
    { name: 'وسط', مدن: 4, مواعيد: 185, نسبة: 41 },
    { name: 'ساحل', مدن: 2, مواعيد: 65, نسبة: 15 }
  ]

  const monthlyCityTrend = [
    { name: 'ديسمبر', دمشق: 45, حلب: 32, حمص: 28, اللاذقية: 18 },
    { name: 'يناير', دمشق: 62, حلب: 45, حمص: 38, اللاذقية: 25 },
    { name: 'فبراير', دمشق: 58, حلب: 42, حمص: 35, اللاذقية: 22 },
  ]

  const getCityDescription = (cityName: string) => {
    const descriptions: { [key: string]: string } = {
      'دمشق': 'العاصمة - أكبر تجمع سكاني',
      'حلب': 'شمال سوريا - مركز صناعي وتجاري',
      'حمص': 'وسط سوريا - موقع استراتيجي',
      'اللاذقية': 'الساحل السوري - مدينة سياحية',
      'درعا': 'جنوب سوريا - منطقة زراعية',
      'حماة': 'وسط سوريا - نهر العاصي',
      'طرطوس': 'الساحل السوري - ميناء بحري',
      'السويداء': 'جنوب سوريا - منطقة جبلية'
    }
    return descriptions[cityName] || 'مدينة سورية'
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">إجمالي المواعيد</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalAppointments}</div>
            <p className="text-xs text-blue-600 mt-1">جميع المدن</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">أكثر مدينة نشاطاً</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-900">
              {sortedData.length > 0 ? sortedData[0].name : '-'}
            </div>
            <p className="text-xs text-green-600">
              {sortedData.length > 0 ? `${sortedData[0].value} موعد` : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">عدد المدن</CardTitle>
            <Building2 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{cityData.length}</div>
            <p className="text-xs text-orange-600">مدينة نشطة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">متوسط المواعيد</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {Math.round(totalAppointments / cityData.length)}
            </div>
            <p className="text-xs text-purple-600">لكل مدينة</p>
          </CardContent>
        </Card>
      </div>

      {/* City Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Appointments by City */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">المواعيد حسب المدينة</CardTitle>
            <p className="text-sm text-muted-foreground">
              توزيع عدد المواعيد عبر المدن السورية
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="عدد المواعيد"
                    fill="#0088FE" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - City Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">التوزيع الجغرافي</CardTitle>
            <p className="text-sm text-muted-foreground">
              النسبة المئوية للمواعيد في كل مدينة
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sortedData}
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
                    {sortedData.map((entry, index) => (
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

      {/* Regional Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">التحليل الإقليمي</CardTitle>
          <p className="text-sm text-muted-foreground">
            توزيع المواعيد حسب المناطق الجغرافية
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={regionalDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="مواعيد" 
                  name="عدد المواعيد"
                  fill="#413ea0" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="نسبة" 
                  name="النسبة %"
                  stroke="#ff7300" 
                  strokeWidth={3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* City Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">تحليل أداء المدن</CardTitle>
          <p className="text-sm text-muted-foreground">
            مقارنة شاملة بين المدن من حيث المواعيد والإيرادات والنمو
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={cityAnalysisData}
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
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'إيرادات') return [formatCurrency(Number(value)), 'الإيرادات']
                    if (name === 'نمو') return [`${value}%`, 'نسبة النمو']
                    return [value, name]
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="مواعيد" 
                  name="عدد المواعيد"
                  fill="#0088FE" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="نمو" 
                  name="نسبة النمو %"
                  stroke="#FF8042" 
                  strokeWidth={3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend by City */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">الاتجاه الشهري للمدن الرئيسية</CardTitle>
          <p className="text-sm text-muted-foreground">
            تطور عدد المواعيد في المدن الرئيسية
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyCityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="دمشق" 
                  name="دمشق"
                  stroke="#0088FE" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="حلب" 
                  name="حلب"
                  stroke="#00C49F" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="حمص" 
                  name="حمص"
                  stroke="#FF8042" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="اللاذقية" 
                  name="اللاذقية"
                  stroke="#FFBB28" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed City Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">تحليل مفصل للمدن</CardTitle>
          <p className="text-sm text-muted-foreground">
            إحصائيات شاملة لكل مدينة مع مؤشرات الأداء
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedData.map((city, index) => {
              const analysis = cityAnalysisData.find(c => c.name === city.name)
              return (
                <div key={city.name} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-xl text-gray-900">
                        {city.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getCityDescription(city.name)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {((city.value / totalAppointments) * 100).toFixed(1)}% من إجمالي المواعيد
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex gap-8 items-center">
                      <div>
                        <div className="font-bold text-2xl text-blue-600">
                          {city.value}
                        </div>
                        <div className="text-sm text-gray-600">
                          موعد
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-2xl text-green-600">
                          {analysis ? formatCurrency(analysis.إيرادات) : formatCurrency(0)}
                        </div>
                        <div className="text-sm text-gray-600">
                          إيرادات
                        </div>
                      </div>
                      <div>
                        <div className={`font-bold text-2xl ${analysis && analysis.نمو > 15 ? 'text-green-600' : 'text-orange-600'}`}>
                          {analysis ? `${analysis.نمو.toFixed(1)}%` : '0%'}
                        </div>
                        <div className="text-sm text-gray-600">
                          نمو
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-2xl text-purple-600">
                          {analysis ? `${analysis.كفاءة.toFixed(1)}%` : '0%'}
                        </div>
                        <div className="text-sm text-gray-600">
                          كفاءة
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Regional Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-900 text-lg mb-3">ملخص المناطق</h3>
              <div className="space-y-3">
                {regionalDistributionData.map(region => (
                  <div key={region.name} className="flex justify-between items-center">
                    <span className="text-blue-800">{region.name}</span>
                    <div className="text-right">
                      <div className="font-semibold text-blue-900">{region.مواعيد} موعد</div>
                      <div className="text-sm text-blue-700">{region.نسبة}% من الإجمالي</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
              <h3 className="font-semibold text-green-900 text-lg mb-3">أداء المدن</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-green-800">
                  <span>أعلى 3 مدن</span>
                  <span className="font-semibold">
                    {((sortedData.slice(0, 3).reduce((sum, item) => sum + item.value, 0) / totalAppointments) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(sortedData.slice(0, 3).reduce((sum, item) => sum + item.value, 0) / totalAppointments) * 100}%` 
                    }}
                  />
                </div>
                <div className="text-sm text-green-700">
                  تشكل المدن الرئيسية غالبية النشاط
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}