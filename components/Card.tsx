"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ghost" | "outline" | "flat";
  size?: "sm" | "md" | "lg";
  hover?: boolean;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: "default" | "tight" | "loose" | "none";
  divide?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = "",
      variant = "default",
      size = "md",
      hover = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "rounded-lg transition-all duration-200";

    const variantStyles = {
      default: "bg-white shadow-md hover:shadow-lg",
      ghost: "bg-gray-50 border border-gray-100",
      outline: "border border-gray-200 bg-transparent",
      flat: "bg-white border border-gray-100",
    };

    const sizeStyles = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const hoverStyles = hover ? "hover:border-gray-300 hover:bg-gray-50" : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-2xl font-semibold leading-none tracking-tight text-gray-900 ${className}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <p ref={ref} className={`text-sm text-gray-500 ${className}`} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", spacing = "default", divide = false, ...props }, ref) => {
    const spacingStyles = {
      default: "p-6",
      tight: "p-4",
      loose: "p-8",
      none: "p-0",
    };

    const divideStyles = divide ? "border-t border-gray-100" : "";

    return (
      <div
        ref={ref}
        className={`${spacingStyles[spacing]} ${divideStyles} ${className}`}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center justify-between p-6 pt-0 ${className}`}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
