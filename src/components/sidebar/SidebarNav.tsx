
import { SidebarItem } from "./SidebarItem";
import { NavItem } from "@/types/navigation";

interface SidebarNavProps {
  items: NavItem[];
  mainPath: string
}

export function SidebarNav({ items,mainPath }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1 mt-4">
      {items.map((item) => (
        <SidebarItem key={item.href} item={item} mainPath={mainPath} />
      ))}
    </nav>
  );
}
