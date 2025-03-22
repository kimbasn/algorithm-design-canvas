import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCanvasContext } from '@/context/CanvasContext';
import { canvasFormSchema, type Canvas } from '@/types/canvas';

interface EditCanvasDialogProps {
    isOpen: boolean;
    onClose: () => void;
    canvas: Canvas;
    onRename: (canvas: Canvas) => void;
}

export default function EditCanvasDialog({
    isOpen,
    onClose,
    canvas,
    onRename
}: EditCanvasDialogProps) {
    // Initialize the form
    const form = useForm<z.infer<typeof canvasFormSchema>>({
        resolver: zodResolver(canvasFormSchema),
        defaultValues: {
            problemName: '',
            problemUrl: '',
        },
    });

    // Update form values when canvas changes
    useEffect(() => {
        if (canvas) {
            form.reset({
                problemName: canvas.problemName,
            });
        }
    }, [canvas, form]);

    // Form submission handler
    const onSubmit = (data: { problemName: string | null; problemUrl: string | null; }) => {
        if (canvas) {
            onRename({
                ...canvas,
                problemName: (data.problemName ?? '').trim(),
                problemUrl: (data.problemUrl ?? '').trim(),
            });
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Canvas</DialogTitle>
                    <DialogDescription>
                        Enter a new name for your canvas.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="problemName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Canvas Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ''}
                                            autoFocus
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="problemUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Problem URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ''}
                                            autoFocus
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}