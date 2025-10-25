import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  item: NavItem;
  mainPath: string;
}

export function SidebarItem({ item,mainPath }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const fullhref = mainPath+item.href
  return (
    <Link
      href={fullhref}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted",
        isActive && "bg-muted text-primary font-medium"
      )}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.label}</span>
    </Link>
  );
}
