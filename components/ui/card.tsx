import { cn } from "@/lib/utils"; // Optional: helper for merging classNames
import React from "react";

export function Card({ className, children }: React.ComponentProps<"div">) {
  return (
    <div className={cn("rounded-xl border bg-white shadow p-4", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
}: React.ComponentProps<"div">) {
  return <div className={cn("mb-2", className)}>{children}</div>;
}

export function CardTitle({ className, children }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}

export function CardContent({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-sm text-gray-800", className)}>{children}</div>
  );
}
