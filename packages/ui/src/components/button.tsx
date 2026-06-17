import * as React from "react"

type ButtonVariant = "default" | "ghost"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const baseClassName =
  "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"

const variantClassNames: Record<ButtonVariant, string> = {
  default: "bg-[#1D4ED8] px-4 py-2 text-white hover:bg-[#1E40AF]",
  ghost: "hover:bg-[#F1F5F9]",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const mergedClassName = [baseClassName, variantClassNames[variant], className]
      .filter(Boolean)
      .join(" ")

    return <button className={mergedClassName} ref={ref} {...props} />
  }
)

Button.displayName = "Button"
