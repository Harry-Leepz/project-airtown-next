"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type UserNavProps = {
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

const links = [
  {
    title: "Profile",
    href: "/user/profile",
  },
  {
    title: "Orders",
    href: "/user/orders",
  },
];

export default function UserNav({ className, ...props }: UserNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "" : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
