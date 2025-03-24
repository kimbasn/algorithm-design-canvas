import { useNavigate } from '@tanstack/react-router';
import { useCanvasContext } from '@/context/CanvasContext';
import { useState } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuAction,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, Edit, DeleteIcon } from 'lucide-react';
import { type Canvas } from '@/types/canvas';
import CreateCanvasForm from '@/components/Canvas/CreateCanvasForm';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CanvasSidebar() {
    const { canvases, currentCanvas, setCurrentCanvas, createCanvas, updateCanvas, deleteCanvas } = useCanvasContext();
    const navigate = useNavigate();
    const [canvasToEdit, setCanvasToEdit] = useState<Canvas | null>(null);
    const [canvasToDelete, setCanvasToDelete] = useState<Canvas | null>(null);
    const [newCanvasName, setNewCanvasName] = useState('');
    const [newCanvasUrl, setNewCanvasUrl] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleCanvasSelect = (canvas: Canvas) => {
        setCurrentCanvas(canvas);
        navigate({ to: `/canvases/${canvas.canvasId}` });
    };

    const handleEditClick = (canvas: Canvas) => {
        setCanvasToEdit(canvas);
        setNewCanvasName(canvas.problemName);
        setNewCanvasUrl(canvas.problemUrl ?? '');
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (canvas: Canvas) => {
        setCanvasToDelete(canvas);
        setDeleteDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        if (canvasToEdit && newCanvasName.trim()) {
            try {
                await updateCanvas(
                    canvasToEdit.canvasId,
                    {
                        problemName: newCanvasName.trim(),
                        problemUrl: newCanvasUrl.trim(),
                    }
                );
                toast.success("Canvas updated", {
                    description: `"${newCanvasName.trim()}" has been updated successfully`,
                });
                setEditDialogOpen(false);
                setCanvasToEdit(null);
                setNewCanvasName('');
            } catch (error) {
                toast.error("Failed to update canvas", {
                    description: "Please try again",
                });
            }
        }
    };

    const handleDeleteSubmit = async () => {
        if (canvasToDelete) {
            const canvasName = canvasToDelete.problemName;
            const canvasId = canvasToDelete.canvasId;
            const canvasUrl = canvasToDelete.problemUrl;

            try {
                await deleteCanvas(canvasId);

                // Only proceed with UI updates and navigation after successful deletion
                if (currentCanvas?.canvasId === canvasId) {
                    const remainingCanvases = canvases.filter(c => c.canvasId !== canvasId);
                    if (remainingCanvases.length > 0) {
                        handleCanvasSelect(remainingCanvases[0]);
                    } else {
                        const newCanvas = await createCanvas({
                            problemName: 'New Canvas',
                            problemUrl: ''
                        });
                        setCurrentCanvas(newCanvas);
                        navigate({ to: `/canvases/${newCanvas.canvasId}` });
                    }
                }

                toast.success("Canvas deleted", {
                    description: `"${canvasName}" has been deleted`,
                    action: {
                        label: "Undo",
                        onClick: async () => {
                            try {
                                // Create a new canvas with the same ID
                                const restoredCanvas = await createCanvas({
                                    problemName: canvasName,
                                    problemUrl: canvasUrl ?? '',
                                    canvasId // Use the original ID
                                });
                                setCurrentCanvas(restoredCanvas);
                                navigate({ to: `/canvases/${restoredCanvas.canvasId}` });
                                toast.success("Canvas restored", {
                                    description: `"${canvasName}" has been restored`,
                                });
                            } catch (error) {
                                toast.error("Failed to restore canvas", {
                                    description: "Please try again",
                                });
                            }
                        },
                    },
                });

                setDeleteDialogOpen(false);
                setCanvasToDelete(null);
            } catch (error) {
                toast.error("Failed to delete canvas", {
                    description: "Please try again",
                });
            }
        }
    };

    return (
        <div>
            <Sidebar className={cn(
                "w-[260px] flex flex-col",
                "bg-white dark:bg-[#1f2937]",
                "border-r border-gray-200 dark:border-gray-700"
            )}>
                <SidebarHeader className={cn(
                    "p-3.5 border-b border-gray-200 dark:border-gray-700",
                    "flex items-center",
                    "bg-gray-50/50 dark:bg-[#1f2937]/50"
                )}>
                    <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Algorithm Design Canvas
                        </span>
                    </div>
                </SidebarHeader>

                <div className="p-5">
                    <CreateCanvasForm />
                </div>

                <SidebarContent className="flex-1 overflow-y-auto">
                    <SidebarMenu>
                        {canvases.map((canvas, index) => (
                            <SidebarMenuItem
                                key={index}
                                className={cn(
                                    "px-5 py-3 flex items-center border-l-3 transition-all cursor-pointer",
                                    currentCanvas?.canvasId === canvas.canvasId
                                        ? "bg-gray-100 dark:bg-[#1f2937] border-l-blue-500"
                                        : "border-l-transparent hover:bg-gray-50 dark:hover:bg-[#1f2937]/50"
                                )}
                                onClick={() => handleCanvasSelect(canvas)}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {canvas.problemName}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Updated {new Date(canvas.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <SidebarMenuAction>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-[#1f2937]/50"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditClick(canvas)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteClick(canvas)}>
                                                <DeleteIcon className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SidebarMenuAction>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>

                <div className={cn(
                    "p-3 border-t border-gray-200 dark:border-gray-700",
                    "flex items-center",
                    "bg-gray-50/50 dark:bg-[#1f2937]/50",
                    "text-gray-900 dark:text-gray-100"
                )}>
                    Total Canvas: {canvases.length}
                </div>
            </Sidebar>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Canvas</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="problemName">Problem Name</Label>
                        <Input
                            id="problemName"
                            value={newCanvasName}
                            onChange={(e) => setNewCanvasName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="py-4">
                        <Label htmlFor="problemUrl">Problem URL</Label>
                        <Input
                            id="problemUrl"
                            value={newCanvasUrl}
                            onChange={(e) => setNewCanvasUrl(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditSubmit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Canvas</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{canvasToDelete?.problemName}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteSubmit}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}