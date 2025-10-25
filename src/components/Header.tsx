"use client";

import Image from "next/image";
import Logo from "./Logo";

interface HeaderProps {
  appName: string;
  logoSrc: string;
}

export function Header({ appName, logoSrc }: HeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-2 p-4 border-b">
      <div>
      <Logo logoSrc={logoSrc} />
      
      </div>
      <h1 className="text-3xl font-semibold">{appName}</h1>
    </div>
  );
}
