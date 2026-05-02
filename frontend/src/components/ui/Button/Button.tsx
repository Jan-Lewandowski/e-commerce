import React from "react"
import "@/components/ui/Button/button.scss"

type ButtonProps = {
  children: React.ReactNode;
  variant?: "destructive" | "outline" | "ghost";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};


export default function Button({
  children,
  variant,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  disabled,
  type
}: ButtonProps) {

  let variantClass = "";

  switch (variant) {

    case "destructive":
      variantClass = "btn-destructive";
      break;

    case "outline":
      variantClass = "btn-outline";
      break;

    case "ghost":
      variantClass = "btn-ghost";
      break;

    default:
      variantClass = "btn-default";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      className={`btn ${variantClass} ${className}`}

    >
      {children}
    </button>
  );
}