"use client"
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MedicalReport } from '../types/medical'
import { Download, Search, Filter } from 'lucide-react'

interface DetailsTabProps {
  data: MedicalReport[]
}

interface SortableHeaderProps {
  field: keyof MedicalReport;
  children: React.ReactNode;
  onSort: (field: keyof MedicalReport) => void;
  sortField: keyof MedicalReport;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ field, children, onSort, sortField }) => (
  <th 
    className="px-4 py-2 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
    onClick={() => onSort(field)}
  >
    <div className="flex items-center justify-end gap-1">
      {children}
      <Filter className={`w-3 h-3 ${
        sortField === field ? 'text-blue-600' : 'text-gray-400'
      }`} />
    </div>
  </th>
)

export const DetailsTab: React.FC<DetailsTabProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof MedicalReport>('city')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSort = (field: keyof MedicalReport) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const exportToCSV = () => {
    const headers = ['المدينة', 'الفئة العمرية', 'المرض', 'عدد الحالات', 'التاريخ']
    const csvData = filteredAndSortedData.map(item => [
      item.city,
      item.ageGroup,
      item.disease,
      item.count.toString(),
      item.date
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'التقارير_الطبية.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>تفاصيل التقارير</CardTitle>
            <CardDescription>
              جميع البيانات المفصلة مع إمكانية البحث والترتيب
            </CardDescription>
          </div>
          <Button onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            تصدير إلى CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Box */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ابحث في جميع البيانات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-muted-foreground">
          عرض {filteredAndSortedData.length} من أصل {data.length} سجل
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader field="city" onSort={handleSort} sortField={sortField}>المدينة</SortableHeader>
                  <SortableHeader field="ageGroup" onSort={handleSort} sortField={sortField}>الفئة العمرية</SortableHeader>
                  <SortableHeader field="disease" onSort={handleSort} sortField={sortField}>المرض</SortableHeader>
                  <SortableHeader field="count" onSort={handleSort} sortField={sortField}>عدد الحالات</SortableHeader>
                  <SortableHeader field="date" onSort={handleSort} sortField={sortField}>التاريخ</SortableHeader>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAndSortedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{item.city}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.ageGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.disease}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold">{item.count}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد نتائج مطابقة للبحث
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-gray-900">{data.length}</div>
            <div className="text-sm text-muted-foreground">إجمالي السجلات</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-gray-900">
              {new Set(data.map(item => item.city)).size}
            </div>
            <div className="text-sm text-muted-foreground">مدينة</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-gray-900">
              {new Set(data.map(item => item.disease)).size}
            </div>
            <div className="text-sm text-muted-foreground">مرض</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-gray-900">
              {data.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-sm text-muted-foreground">إجمالي الحالات</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}