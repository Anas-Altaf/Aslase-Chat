import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] relative overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25 hover:from-green-600 hover:to-emerald-600 hover:shadow-xl hover:shadow-green-500/35 hover:scale-[1.02] focus-visible:ring-green-400 btn-shine",
                gradient:
                    "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:from-green-500 hover:via-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.03] focus-visible:ring-emerald-400 btn-shine animate-gradient bg-[length:200%_200%]",
                glass:
                    "bg-white/70 backdrop-blur-md border border-white/30 text-gray-800 shadow-lg hover:bg-white/90 hover:shadow-xl hover:scale-[1.02] focus-visible:ring-green-400",
                destructive:
                    "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-rose-600 hover:shadow-xl hover:shadow-red-500/35 hover:scale-[1.02] focus-visible:ring-red-400",
                outline:
                    "border-2 border-gray-200 bg-white text-gray-700 shadow-sm hover:border-green-400 hover:bg-green-50/50 hover:text-green-700 hover:shadow-md hover:scale-[1.01] focus-visible:ring-green-400",
                secondary:
                    "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 hover:shadow-md focus-visible:ring-green-400",
                ghost:
                    "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm",
                link:
                    "text-green-600 underline-offset-4 hover:underline hover:text-green-700 hover:scale-[1.01]",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-12 px-7 py-3 text-base",
                xl: "h-14 px-10 py-4 text-lg",
                icon: "h-10 w-10",
            },
            rounded: {
                default: "rounded-xl",
                full: "rounded-full",
                lg: "rounded-2xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            rounded: "default",
        },
    }
);


export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            rounded,
            asChild = false,
            isLoading = false,
            loadingText,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";

        if (asChild) {
            return (
                <Comp
                    className={cn(buttonVariants({ variant, size, rounded, className }))}
                    ref={ref}
                    {...props}
                >
                    {children}
                </Comp>
            );
        }

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, rounded, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" />
                        {loadingText || children}
                    </>
                ) : (
                    children
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
