// app/providers.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'sonner'
import { useSignalR } from '@/features/notifications /hooks/use-signalr'

export function Providers({ children }: { children: React.ReactNode }) {
  // useSignalR();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
      {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
    </QueryClientProvider>
  )
}