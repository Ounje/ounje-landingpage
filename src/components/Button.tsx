import React from "react";
import { cn } from "../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none ";

  const variants = {
    primary:
      "bg-accent-400 hover:bg-accent-500 text-white focus:ring-accent-400",
    secondary: "focus:ring-primary-400",
    outline:
      "border-2 border-accent-400 text-accent-400 hover:bg-accent-400 hover:text-white focus:ring-accent-400",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
