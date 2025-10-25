
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Logout from "@/features/authentication/components/Logout";

interface SidebarHeaderProps {
  firstName: string;
  lastName: string;
  onLogout: () => void;
}

export function SidebarHeader({ firstName, lastName, onLogout }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      

      {/* User Info + Logout */}
      <div className="flex flex-row justify-between items-center gap-3 w-full">
        <div className="text-sm">
          <p className="font-medium">{firstName} {lastName}</p>
        </div>
        <Logout onLogout={onLogout} />
      </div>
    </div>
  );
}
