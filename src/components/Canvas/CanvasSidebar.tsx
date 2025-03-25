import { useNavigate } from '@tanstack/react-router';
import { useCanvasContext } from '@/context/CanvasContext';
import { useState, useEffect } from 'react';
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, Edit, DeleteIcon, Search } from 'lucide-react';
import { type Canvas } from '@/types/canvas';
import CreateCanvasForm from '@/components/Canvas/CreateCanvasForm';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CanvasSidebar() {
    const { canvases, currentCanvas, setCurrentCanvas, updateCanvas, deleteCanvas } = useCanvasContext();
    const navigate = useNavigate();
    const [canvasToEdit, setCanvasToEdit] = useState<Canvas | null>(null);
    const [canvasToDelete, setCanvasToDelete] = useState<Canvas | null>(null);
    const [newCanvasName, setNewCanvasName] = useState('');
    const [newCanvasUrl, setNewCanvasUrl] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSearchQuery('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter canvases based on search query
    const filteredCanvases = canvases.filter(canvas =>
        canvas.problemName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCanvasSelect = (canvas: Canvas) => {
        setCurrentCanvas(canvas);
        navigate({ to: `/canvases/${canvas.canvasId}` });
        setSearchQuery('');
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

            try {
                // If we're deleting the current canvas, clear it first to prevent flickering
                if (currentCanvas?.canvasId === canvasId) {
                    setCurrentCanvas(null);
                }

                await deleteCanvas(canvasId);

                // Let the root component handle navigation if needed
                setDeleteDialogOpen(false);
                setCanvasToDelete(null);

                toast.success("Canvas deleted", {
                    description: `"${canvasName}" has been deleted`,
                });
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

                <div className="p-5 flex flex-col gap-4">
                    <CreateCanvasForm />
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search canvases..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                </div>

                <SidebarContent className="flex-1 overflow-y-auto">
                    <SidebarMenu>
                        {filteredCanvases.map((canvas, index) => (
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
                                {canvas.problemName.length > 20 ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {canvas.problemName.slice(0, 20)}...
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Updated {new Date(canvas.updatedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{canvas.problemName}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {canvas.problemName}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Updated {new Date(canvas.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                )}

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
                    "flex items-center justify-between",
                    "bg-gray-50/50 dark:bg-[#1f2937]/50",
                    "text-gray-900 dark:text-gray-100"
                )}>
                    <span>Total Canvas: {canvases.length}</span>
                    {searchQuery && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {filteredCanvases.length} found
                        </span>
                    )}
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