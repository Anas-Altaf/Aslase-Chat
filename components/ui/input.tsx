import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-lg border border-gray-200/80 bg-white px-3.5 py-2 text-sm text-gray-900 shadow-sm transition-all duration-200",
                    "placeholder:text-gray-400",
                    "hover:border-gray-300",
                    "focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500",
                    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
