import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "destructive" | "outline" | "ghost";
};


export default function Button({
  children,
  variant,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  disabled,
  type,
  ...props
}: ButtonProps) {

  let variantClass = "";

  switch (variant) {

    case "destructive":
      variantClass = "border-red-500 bg-red-500 text-white shadow-sm hover:bg-red-600";
      break;

    case "outline":
      variantClass = "border-slate-300 bg-white text-slate-700 shadow-sm hover:border-orange-300 hover:text-orange-700";
      break;

    case "ghost":
      variantClass = "border-transparent bg-transparent text-slate-700 hover:bg-slate-100";
      break;

    default:
      variantClass = "border-orange-500 bg-orange-500 text-white shadow-sm hover:bg-orange-600";
  }

  const baseClass = "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-60 [&>svg]:min-h-5 [&>svg]:min-w-5 [&>svg]:shrink-0";

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${className ?? ""}`}
      {...props}

    >
      {children}
    </button>
  );
}
