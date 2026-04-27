import { cn } from "../utils/cn";

export function Card({ className, children, hover = true }) {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl p-8 border border-black/5 shadow-sm transition-all duration-400 flex flex-col",
        hover && "hover:-translate-y-1 hover:shadow-float",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Button({ className, children, variant = "primary", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-[15px] transition-all duration-300",
        variant === "primary" && "bg-gradient-to-r from-primary to-primary-dark text-white shadow-float hover:-translate-y-0.5 hover:shadow-float-hover",
        variant === "secondary" && "bg-bg-secondary text-text-main border border-black/5 hover:bg-black/5 shadow-none",
        variant === "doctor" && "bg-gradient-to-r from-[#00C853] to-[#009624] text-white shadow-[0_8px_16px_rgba(0,200,83,0.2)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,200,83,0.3)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}