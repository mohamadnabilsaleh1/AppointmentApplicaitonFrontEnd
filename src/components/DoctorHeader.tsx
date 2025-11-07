// components/DoctorHeader.tsx
"use client";

import { NotificationBell } from "@/features/notifications /components/notification-bell";
import Logo from "./Logo";

interface DoctorHeaderProps {
  appName: string;
  logoSrc: string;
}

export function DoctorHeader({ appName, logoSrc }: DoctorHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-2 p-4 border-b">
      <div className="flex items-center gap-4">
        <Logo logoSrc={logoSrc} />

        <h1 className="text-3xl font-semibold">{appName}</h1>
      </div>

      {/* Notification Bell and User Menu Area */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        {/* You can add user profile dropdown here later */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            DR
          </div>
          <span className="text-sm font-medium">Doctor</span>
        </div>
      </div>
    </div>
  );
}
