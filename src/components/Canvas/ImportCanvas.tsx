import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useCanvasContext } from '@/context/CanvasContext';
import { Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ImportCanvas() {
    const [open, setOpen] = useState(false);
    const [duplicates, setDuplicates] = useState<{ canvasId: string; problemName: string }[]>([]);
    const { importCanvases } = useCanvasContext();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Import canvases and check for duplicates
            const { totalImported, duplicates: duplicatesCanvases } = await importCanvases(data);

            if (duplicatesCanvases && duplicatesCanvases.length > 0) {
                setDuplicates(duplicatesCanvases);
            } else {
                toast.success("Canvases Imported", {
                    description: `Imported ${totalImported} canvas${totalImported !== 1 ? 'es' : ''} successfully`,
                });
                setOpen(false);
            }
        } catch (error) {
            toast.error("Error", {
                description: "Failed to import canvases. Please check the file format.",
            });
        }

        // Reset the input
        event.target.value = '';
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Canvases</DialogTitle>
                </DialogHeader>

                {duplicates.length > 0 ? (
                    <div className="space-y-4">
                        <Alert variant="destructive">
                            <AlertDescription>
                                The following canvases already exist:
                                <ul className="list-disc pl-4 mt-2">
                                    {duplicates.map((canvas) => (
                                        <li key={canvas.canvasId}>
                                            {canvas.problemName}
                                        </li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => {
                                setDuplicates([]);
                                setOpen(false);
                            }}
                        >
                            Close
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Select a JSON file containing canvas data to import.
                        </p>
                        <div className="flex justify-center">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".json"
                                    onChange={handleFileSelect}
                                />
                                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm font-medium">
                                        Click to select file
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Only .json files are supported
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
