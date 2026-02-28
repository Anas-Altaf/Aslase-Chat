import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(
            "block text-sm font-medium text-gray-700 leading-none mb-1.5",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            "transition-colors duration-150",
            className
        )}
        {...props}
    />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
