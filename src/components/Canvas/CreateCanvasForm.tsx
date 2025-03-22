import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

import { useCanvasContext } from '@/context/CanvasContext';

import { canvasSchema } from '@/types/canvas';
import { useNavigate } from '@tanstack/react-router';

export default function CreateCanvasForm() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { setCurrentCanvas, createCanvas } = useCanvasContext();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof canvasSchema>>({
        resolver: zodResolver(canvasSchema),
        defaultValues: {
            problemName: '',
            problemUrl: '',
        },
    });

    async function onSubmit(values: z.infer<typeof canvasSchema>) {
        try {
            setIsLoading(true);
            const newCanvas = await createCanvas({
                ...values,
                problemUrl: values.problemUrl ?? '',
            });
            setCurrentCanvas(newCanvas);
            form.reset();
            setOpen(false);
            toast.success("Canvas created", {
                description: `"${values.problemName}" has been created successfully`,
                // action: {
                //     label: "View",
                //     onClick: () => navigate({ to: `/canvases/${newCanvas.canvasId}` })
                // },
            })
        } catch (error) {
            toast.error("Failed to create canvas", {
                description: "Please try again",
            })
        } finally {
            setIsLoading(false);
        }
    }

    function onCancel() {
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Plus className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Canvas</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="problemName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Problem Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Problem Name"
                                            {...field}
                                            value={field.value ?? ''}
                                            disabled={isLoading}
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
                                            placeholder="Problem URL"
                                            {...field}
                                            value={field.value ?? ''}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                onClick={() => onSubmit(form.getValues())}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner size="sm" className="mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}