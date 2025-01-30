import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface HeroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const HeroButton = ({ 
  variant = "primary",
  children,
  className,
  ...props
}: HeroButtonProps) => {
  return (
    <button
      className={cn(
        "px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-[1.02]",
        variant === "primary" 
          ? "bg-primary text-primary-foreground hover:opacity-90" 
          : "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};