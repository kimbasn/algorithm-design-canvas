import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CanvasSectionProps {
    title: string;
    placeholder: string;
    icon?: React.ReactNode;
}

export default function CanvasSection({ title, placeholder, icon }: CanvasSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={cn(
            "flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out",
            "border-b border-gray-200 dark:border-gray-700",
            !isExpanded && "flex-none"
        )}>
            <div className={cn(
                "px-4 py-3 font-semibold flex justify-between items-center",
                "border-b border-gray-200 dark:border-gray-700",
                "bg-gray-50/50 dark:bg-[#1f2937]/50"
            )}>
                <div className="flex items-center gap-2">
                    {icon || <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                    <span className="text-gray-900 dark:text-gray-100">{title}</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-[#1f2937]/50"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    )}
                </Button>
            </div>
            {isExpanded && (
                <Textarea
                    placeholder={placeholder}
                    className={cn(
                        "w-full border-none outline-none bg-transparent",
                        "overflow-y-auto flex-1 resize-none p-4",
                        "text-sm leading-relaxed",
                        "text-gray-900 dark:text-gray-100",
                        "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                        "focus-visible:ring-0 focus-visible:ring-offset-0",
                        "focus:bg-gray-50/50 dark:focus:bg-[#1f2937]/50"
                    )}
                    data-placeholder={placeholder}
                />
            )}
        </div>
    );
}