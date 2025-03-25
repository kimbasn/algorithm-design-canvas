import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToPDF } from '@/lib/pdf';
import { useCanvasContext } from '@/context/CanvasContext';
import { toast } from 'sonner';

export default function ExportCanvas() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const { currentCanvas } = useCanvasContext();

    const handleExport = async () => {
        if (!canvasRef.current) return;

        try {
            const success = await exportToPDF(
                canvasRef.current,
                `${currentCanvas?.problemName || 'canvas'}.pdf`
            );

            if (success) {
                toast.success("Canvas exported successfully", {
                    description: "Your canvas has been exported to PDF",
                });
            } else {
                throw new Error('Export failed');
            }
        } catch (error) {
            toast.error("Failed to export canvas", {
                description: "Please try again",
            });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
            >
                <Download className="h-4 w-4" />
                Export PDF
            </Button>

            {/* Hidden div for PDF export */}
            <div className="hidden">
                <div ref={canvasRef} className="p-8 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold mb-6">
                            {currentCanvas?.problemName}
                        </h1>

                        {/* Problem URL */}
                        {currentCanvas?.problemUrl && (
                            <div className="mb-6">
                                <h2 className="text-sm font-medium text-gray-500 mb-1">Problem URL</h2>
                                <p className="text-sm text-blue-600">{currentCanvas.problemUrl}</p>
                            </div>
                        )}

                        {/* Ideas Section */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4">Ideas</h2>
                            <div className="space-y-4">
                                {currentCanvas?.ideas?.map((idea, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="font-medium mb-1">{idea.title}</div>
                                            <div className="text-sm text-gray-600">{idea.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Time Complexity Section */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4">Time Complexity</h2>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="font-medium mb-1">Best Case</div>
                                <div className="text-sm text-gray-600">{currentCanvas?.timeComplexity?.bestCase || 'Not specified'}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg mt-4">
                                <div className="font-medium mb-1">Average Case</div>
                                <div className="text-sm text-gray-600">{currentCanvas?.timeComplexity?.averageCase || 'Not specified'}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg mt-4">
                                <div className="font-medium mb-1">Worst Case</div>
                                <div className="text-sm text-gray-600">{currentCanvas?.timeComplexity?.worstCase || 'Not specified'}</div>
                            </div>
                        </div>

                        {/* Space Complexity Section */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4">Space Complexity</h2>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="font-medium mb-1">Best Case</div>
                                <div className="text-sm text-gray-600">{currentCanvas?.spaceComplexity?.bestCase || 'Not specified'}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg mt-4">
                                <div className="font-medium mb-1">Average Case</div>
                                <div className="text-sm text-gray-600">{currentCanvas?.spaceComplexity?.averageCase || 'Not specified'}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg mt-4">
                                <div className="font-medium mb-1">Worst Case</div>
                                <div className="text-sm text-gray-600">{currentCanvas?.spaceComplexity?.worstCase || 'Not specified'}</div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        {currentCanvas?.notes && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-4">Notes</h2>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-600 whitespace-pre-wrap">
                                        {currentCanvas.notes}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 