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
import { type Canvas } from '@/types/canvas';

interface DeleteCanvasDialogProps {
    isOpen: boolean;
    onClose: () => void;
    canvas: Canvas;
    onDelete: (canvasId: number) => void;
}


export default function DeleteCanvasDialog({
    isOpen,
    onClose,
    canvas,
    onDelete
}: DeleteCanvasDialogProps) {
    const handleDelete = () => {
        if (canvas) {
            onDelete(canvas.canvasId);
            onClose();
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Canvas</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete "{canvas?.problemName}"? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}