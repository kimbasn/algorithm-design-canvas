import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useCanvasContext } from '@/context/CanvasContext';
import { Download } from 'lucide-react';

export function ExportCanvas() {
    const [open, setOpen] = useState(false);
    const [selectedCanvases, setSelectedCanvases] = useState<string[]>([]);
    const { canvases } = useCanvasContext();

    const handleExport = async () => {
        try {
            const selectedData = canvases.filter(canvas =>
                selectedCanvases.includes(canvas.canvasId)
            );

            if (selectedData.length === 0) {
                toast.error("No canvases selected", {
                    description: "Please select at least one canvas to export.",
                });
                return;
            }

            const dataStr = JSON.stringify(selectedData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'canvases.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success("Canvases Exported", {
                description: `Exported ${selectedData.length} canvas${selectedData.length !== 1 ? 'es' : ''}`,
            });
            setOpen(false);
        } catch (error) {
            toast.error("Error", {
                description: "Failed to export canvases.",
            });
        }
    };

    const toggleCanvas = (canvasId: string) => {
        setSelectedCanvases(prev =>
            prev.includes(canvasId)
                ? prev.filter(id => id !== canvasId)
                : [...prev, canvasId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Canvases</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Select the canvases you want to export:
                    </p>
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                        {canvases.map(canvas => (
                            <div key={canvas.canvasId} className="flex items-center space-x-2">
                                <Checkbox
                                    id={canvas.canvasId}
                                    checked={selectedCanvases.includes(canvas.canvasId)}
                                    onCheckedChange={() => toggleCanvas(canvas.canvasId)}
                                />
                                <label
                                    htmlFor={canvas.canvasId}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {canvas.problemName}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleExport}
                            disabled={selectedCanvases.length === 0}
                        >
                            Export Selected
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
