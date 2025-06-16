import { cn } from "@/lib/utils"; // Optional again

interface ProgressProps {
  value: number;
  className?: string;
  color?: string; // optional color override
}

export function Progress({
  value,
  className,
  color = "bg-blue-600",
}: ProgressProps) {
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2.5", className)}>
      <div
        className={cn("h-2.5 rounded-full transition-all duration-500", color)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
