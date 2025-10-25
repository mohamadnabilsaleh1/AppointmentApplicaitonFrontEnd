// components/Icon.tsx
import React from "react";
import { Home, Users, Settings, Calendar, FileText, Shield, Stethoscope, Building2, UserCheck, ClipboardList } from "lucide-react";

// A mapping of icon names to React components
const iconMap: Record<string, React.ReactNode> = {
  home: <Home />,
  users: <Users />,
  settings: <Settings />,
  calendar: <Calendar />,
  fileText: <FileText />,
  shield: <Shield />,
  stethoscope: <Stethoscope />,
  building2: <Building2 />,
  userCheck: <UserCheck />,
  clipboardList: <ClipboardList />,
};

interface IconProps {
  name: string; // name of the icon
}

export const Icon: React.FC<IconProps> = ({ name }) => {
  return iconMap[name] || null; // Render the corresponding icon or null if not found
};
