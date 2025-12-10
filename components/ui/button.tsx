import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-500/25 hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:shadow-green-500/30 focus-visible:ring-green-400",
                destructive:
                    "bg-red-50 text-red-600 border border-red-200/60 hover:bg-red-100 hover:border-red-300 focus-visible:ring-red-400",
                outline:
                    "border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900",
                secondary:
                    "bg-green-50 text-green-700 border border-green-200/60 hover:bg-green-100 hover:border-green-300 focus-visible:ring-green-400",
                ghost:
                    "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900",
                link:
                    "text-green-600 underline-offset-4 hover:underline hover:text-green-700",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-11 px-6 py-3 text-base",
                xl: "h-12 px-8 py-3.5 text-base",
                icon: "h-9 w-9",
            },
            rounded: {
                default: "rounded-lg",
                full: "rounded-full",
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
