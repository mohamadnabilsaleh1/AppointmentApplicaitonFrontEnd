"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, DollarSign, Users, CheckCircle, Clock, XCircle, Hospital, Stethoscope } from 'lucide-react'

interface StatsCardsProps {
  totalAppointments: number
  totalRevenue: number
  completedAppointments: number
  cancelledAppointments: number
  pendingAppointments: number
  averageFee: number
  uniqueDoctors: number
  uniqueHospitals: number
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalAppointments,
  totalRevenue,
  completedAppointments,
  cancelledAppointments,
  pendingAppointments,
  averageFee,
  uniqueDoctors,
  uniqueHospitals
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0
  const cancellationRate = totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">إجمالي المواعيد</CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{totalAppointments}</div>
          <p className="text-xs text-blue-600 mt-1">جميع المواعيد</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900">إجمالي الإيرادات</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-green-600 mt-1">إيرادات المكتملة</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-900">متوسط قيمة الكشف</CardTitle>
          <DollarSign className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{formatCurrency(averageFee)}</div>
          <p className="text-xs text-orange-600 mt-1">لكل موعد</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-900">نسبة الإنجاز</CardTitle>
          <CheckCircle className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{completionRate.toFixed(1)}%</div>
          <p className="text-xs text-purple-600 mt-1">مواعيد مكتملة</p>
        </CardContent>
      </Card>

      {/* الصف الثاني */}
      <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-cyan-900">قيد الانتظار</CardTitle>
          <Clock className="h-4 w-4 text-cyan-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-900">{pendingAppointments}</div>
          <p className="text-xs text-cyan-600 mt-1">موعد</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-900">ملغية</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">{cancelledAppointments}</div>
          <p className="text-xs text-red-600 mt-1">موعد ({cancellationRate.toFixed(1)}%)</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-indigo-900">عدد الأطباء</CardTitle>
          <Stethoscope className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-900">{uniqueDoctors}</div>
          <p className="text-xs text-indigo-600 mt-1">طبيب نشط</p>
        </CardContent>
      </Card>

      {/* <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-pink-900">عدد المستشفيات</CardTitle>
          <Hospital className="h-4 w-4 text-pink-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-900">{uniqueHospitals}</div>
          <p className="text-xs text-pink-600 mt-1">مستشفى</p>
        </CardContent>
      </Card> */}
    </div>
  )
}