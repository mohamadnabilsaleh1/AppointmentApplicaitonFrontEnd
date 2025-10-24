// app/dashboard/page.tsx
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRoles={["Admin"]}>
      <div>Your protected dashboard content</div>
    </ProtectedRoute>
  )
}