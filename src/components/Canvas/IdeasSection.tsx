import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { useCanvasContext } from "@/context/CanvasContext";
import { Idea } from "@/types/canvas";
interface CanvasIdeasSectionProps {
    title: string;
    placeholder: string;
    icon?: React.ReactNode;
}

export default function CanvasSection({ title, placeholder, icon }: CanvasIdeasSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const { currentCanvas, addIdea, updateIdea, deleteIdea } = useCanvasContext();

    const handleAddIdea = () => {
        if (currentCanvas?.canvasId) {
            addIdea(currentCanvas.canvasId, { description: "", timeComplexity: "", spaceComplexity: "" });
        }
    };

    const handleDeleteIdea = (ideaId: string) => {
        if (currentCanvas?.canvasId) {
            deleteIdea(currentCanvas.canvasId, ideaId);
        }
    };

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
                    <button
                        onClick={handleAddIdea}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-[#1f2937]/50 rounded"
                        aria-label="Add new idea"
                    >
                        <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-[#1f2937]/50"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? "Collapse section" : "Expand section"}
                >
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    )}
                </Button>
            </div>
            {isExpanded && (
                <>
                    <div className="grid grid-cols-2 border-b">
                        <div className="text-gray-900 dark:text-gray-100">Description</div>
                        <div className="text-gray-900 dark:text-gray-100">Complexities</div>
                    </div>
                    {currentCanvas?.ideas.map((idea) => (
                        <div key={idea.ideaId}>
                            <div className="border text-sm">
                                <div className="grid grid-cols-[1fr,auto]">
                                    <div className="grid grid-cols-2">
                                        <div className="p-2 border-r row-span-2 flex flex-col gap-2">
                                            <div

                                                contentEditable={true}
                                                role="textbox"
                                                aria-label="Idea description"
                                                onBlur={(e) => updateIdea(currentCanvas?.canvasId, idea.ideaId, { description: e.currentTarget.innerText })}
                                            >
                                                { idea.ideaId}: {idea.description}
                                            </div>
                                            
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/50"
                                                    onClick={() => handleDeleteIdea(idea.ideaId)}
                                                    aria-label="Delete idea"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            
                                        </div>


                                        <div
                                            className="p-2 border"
                                            contentEditable={true}
                                            role="textbox"
                                            aria-label="Time complexity"
                                            onBlur={(e) => updateIdea(currentCanvas?.canvasId, idea.ideaId, { timeComplexity: e.currentTarget.innerText })}
                                        >
                                            {idea.timeComplexity}
                                        </div>

                                        <div
                                            className="p-2"
                                            contentEditable={true}
                                            role="textbox"
                                            aria-label="Space complexity"
                                            onBlur={(e) => updateIdea(currentCanvas?.canvasId, idea.ideaId, { spaceComplexity: e.currentTarget.innerText })}
                                        >
                                            {idea.spaceComplexity}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}