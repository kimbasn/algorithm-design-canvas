import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CanvasSectionHeaderProps {
    sectionName: "Constraints" | "Test Cases" | "Ideas" | "Code";
    icon?: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
}

export default function CanvasSectionHeader({ sectionName, icon, isExpanded, onToggle }: CanvasSectionHeaderProps) {

    return (
        <div className={cn(
            "px-4 py-3 font-semibold flex justify-between items-center",
            "border-b border-gray-200 dark:border-gray-700",
            "bg-gray-50/50 dark:bg-[#1f2937]/50"
        )}>
            <div className="flex items-center gap-2">
                {icon || <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                <span className="text-gray-900 dark:text-gray-100">{sectionName}</span>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-[#1f2937]/50"
                onClick={onToggle}
            >
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
            </Button>
        </div>
    )

}