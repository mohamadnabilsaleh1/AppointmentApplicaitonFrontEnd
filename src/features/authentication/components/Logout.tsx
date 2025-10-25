import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import React from "react";


interface LogoutProps  {
  onLogout: () => void;
}
export default function Logout({onLogout}:LogoutProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onLogout}>
      <LogOut className="w-5 h-5" />
    </Button>
  );
}

