import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] w-full rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 transition-all duration-150 hover:border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20 focus-visible:border-green-500 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

export { Textarea };
