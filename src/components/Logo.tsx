import React from "react";
import Image from "next/image";
interface HeaderProps {
  logoSrc: string;
}
export default function Logo({ logoSrc }: HeaderProps) {
  return (
    <div className=" flex flex-row space-x-6 items-center">
      <Image
        src={logoSrc}
        alt={`logo`}
        width={32}
        height={32}
        className="rounded text-3xl"
      />
      <h1 className="text-3xl font-semibold">SHIFA</h1>
    </div>
  );
}
