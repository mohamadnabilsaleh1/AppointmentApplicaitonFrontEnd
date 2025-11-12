"use client"
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AppointmentRecord } from '../types/appointment'
import { Download, Search, Filter, ArrowUpDown, Calendar, User, MapPin, Hospital, Stethoscope } from 'lucide-react'

interface DetailsTabProps {
  data: AppointmentRecord[]
}

interface SortableHeaderProps {
  field: keyof AppointmentRecord;
  children: React.ReactNode;
  onSort: (field: keyof AppointmentRecord) => void;
  sortField: keyof AppointmentRecord;
  sortDirection: 'asc' | 'desc';
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ field, children, onSort, sortField, sortDirection }) => (
  <th 
    className="px-4 py-3 font-medium cursor-pointer hover:bg-gray-100 transition-colors bg-gray-50"
    onClick={() => onSort(field)}
  >
    <div className="flex items-center justify-end gap-2">
      {children}
      <div className="flex flex-col">
        <ArrowUpDown className={`w-3 h-3 ${
          sortField === field ? 'text-blue-600' : 'text-gray-400'
        }`} />
      </div>
    </div>
  </th>
)

export const DetailsTab: React.FC<DetailsTabProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof AppointmentRecord>('appointmentDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )

    // Sorting
    return filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })
  }, [data, searchTerm, sortField, sortDirection])

  const handleSort = (field: keyof AppointmentRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SY')
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

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'مكتمل': 'text-green-600 bg-green-100',
      'ملغي': 'text-red-600 bg-red-100',
      'مؤجل': 'text-orange-600 bg-orange-100',
      'قيد الانتظار': 'text-blue-600 bg-blue-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const getPaymentColor = (payment: string) => {
    const colors: { [key: string]: string } = {
      'مدفوع': 'text-green-600 bg-green-100',
      'غير مدفوع': 'text-red-600 bg-red-100',
      'جزئي': 'text-orange-600 bg-orange-100'
    }
    return colors[payment] || 'text-gray-600 bg-gray-100'
  }

  const exportToCSV = () => {
    const headers = [
      'رقم الموعد',
      'اسم الطبيب',
      'التخصص',
      'المستشفى',
      'المدينة',
      'تاريخ الموعد',
      'وقت الموعد',
      'اسم المريض',
      'العمر',
      'الجنس',
      'حالة الموعد',
      'قيمة الكشف',
      'مدة الكشف',
      'حالة الدفع',
      'نوع الموعد',
      'رقم الهاتف'
    ]
    
    const csvData = filteredAndSortedData.map(item => [
      item.id,
      item.doctorName,
      getSpecializationLabel(item.specialization),
      item.hospital,
      item.city,
      formatDate(item.appointmentDate),
      item.appointmentTime,
      item.patientName || 'غير محدد',
      item.patientAge,
      item.patientGender,
      item.status,
      item.fee.toString(),
      item.duration.toString() + ' دقيقة',
      item.paymentStatus,
      item.appointmentType,
      item.phoneNumber || 'غير محدد'
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `تفاصيل_المواعيد_${new Date().toLocaleDateString('ar-SY')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">تفاصيل المواعيد</CardTitle>
            <CardDescription className="text-gray-600">
              جميع سجلات المواعيد مع إمكانية البحث والترتيب والتصدير
            </CardDescription>
          </div>
          <Button onClick={exportToCSV} className="gap-2 bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4" />
            تصدير إلى CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Search Box */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ابحث في جميع البيانات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 bg-white border-gray-300"
          />
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span>عرض {filteredAndSortedData.length} من أصل {data.length} سجل</span>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                مكتمل
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                قيد الانتظار
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                ملغي
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  <SortableHeader field="appointmentDate" onSort={handleSort} sortField={sortField} sortDirection={sortDirection}>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      التاريخ
                    </div>
                  </SortableHeader>
                  <SortableHeader field="doctorName" onSort={handleSort} sortField={sortField} sortDirection={sortDirection}>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      الطبيب
                    </div>
                  </SortableHeader>
                  <SortableHeader field="specialization" onSort={handleSort} sortField={sortField} sortDirection={sortDirection}>
                    <div className="flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" />
                      التخصص
                    </div>
                  </SortableHeader>
                  <SortableHeader field="hospital" onSort={handleSort} sortField={sortField} sortDirection={sortDirection}>
                    <div className="flex items-center gap-1">
                      <Hospital className="w-3 h-3" />
                      المستشفى
                    </div>
                  </SortableHeader>
                  <SortableHeader field="city" onSort={handleSort} sortField={sortField} sortDirection={sortDirection}>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      المدينة
                    </div>
                  </SortableHeader>
                  <SortableHeader field="patientName" onSort={handleSort} sortField={sortField} sortDirection={sortDirection}>
                    المريض
                  </SortableHeader>
                  <SortableHeader field="status" onSort={handleSort} sortField={sortField} sortDirection={sortDirection}>
                    الحالة
                  </SortableHeader>
                  <SortableHeader field="fee" onSort={handleSort} sortField={sortField} sortDirection={sortDirection}>
                    القيمة
                  </SortableHeader>
                  <SortableHeader field="paymentStatus" onSort={handleSort} sortField={sortField} sortDirection={sortDirection}>
                    الدفع
                  </SortableHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{formatDate(item.appointmentDate)}</div>
                      <div className="text-sm text-gray-500">{item.appointmentTime}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.doctorName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getSpecializationLabel(item.specialization)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {item.hospital}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.city}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{item.patientName || 'غير محدد'}</div>
                      <div className="text-sm text-gray-500">
                        {item.patientAge} • {item.patientGender}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-green-600">{formatCurrency(item.fee)}</div>
                      <div className="text-sm text-gray-500">{item.duration} دقيقة</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getPaymentColor(item.paymentStatus)}`}>
                        {item.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-gray-50">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <div className="text-lg font-medium">لا توجد نتائج مطابقة للبحث</div>
              <div className="text-sm mt-1">جرب تعديل كلمات البحث أو الفلاتر</div>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-900">{data.length}</div>
            <div className="text-sm text-blue-700">إجمالي المواعيد</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(data.filter(item => item.paymentStatus === 'مدفوع').reduce((sum, item) => sum + item.fee, 0))}
            </div>
            <div className="text-sm text-green-700">إجمالي الإيرادات</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 text-center">
            <div className="text-2xl font-bold text-orange-900">
              {new Set(data.map(item => item.doctorName)).size}
            </div>
            <div className="text-sm text-orange-700">طبيب مختلف</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-900">
              {new Set(data.map(item => item.hospital)).size}
            </div>
            <div className="text-sm text-purple-700">مستشفى مختلف</div>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">توزيع أنواع المواعيد</h3>
            {Array.from(new Set(data.map(item => item.appointmentType))).map(type => {
              const count = data.filter(item => item.appointmentType === type).length
              return (
                <div key={type} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">{type}</span>
                  <span className="font-semibold text-blue-600">{count}</span>
                </div>
              )
            })}
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">توزيع الأعمار</h3>
            {Array.from(new Set(data.map(item => item.patientAge))).sort().map(age => {
              const count = data.filter(item => item.patientAge === age).length
              return (
                <div key={age} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">{age}</span>
                  <span className="font-semibold text-green-600">{count}</span>
                </div>
              )
            })}
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">مؤشرات الأداء</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">معدل الإنجاز</span>
                <span className="font-semibold text-green-600">
                  {((data.filter(item => item.status === 'مكتمل').length / data.length) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">معدل السداد</span>
                <span className="font-semibold text-blue-600">
                  {((data.filter(item => item.paymentStatus === 'مدفوع').length / data.length) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">متوسط المدة</span>
                <span className="font-semibold text-purple-600">
                  {Math.round(data.reduce((sum, item) => sum + item.duration, 0) / data.length)} دقيقة
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// دالة مساعدة للحصول على مدينة المستشفى
function getHospitalCity(hospitalName: string): string {
  const hospitalCities: { [key: string]: string } = {
    'مشفى الأسد الجامعي': 'دمشق',
    'مشفى حلب الجامعي': 'حلب',
    'مشفى المواساة': 'حمص',
    'مشفى تشرين': 'اللاذقية',
    'مشفى الوطني': 'درعا',
    'مشفى البعث': 'حمص',
    'مشفى الأطفال': 'دمشق',
    'مشفى المواساة الإسلامي': 'حلب'
  }
  return hospitalCities[hospitalName] || 'غير محدد'
}