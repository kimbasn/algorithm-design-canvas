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
} from '@/components/ui/dialog'; import { Button } from "@/components/ui/button"
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
import { useCanvasContext } from '@/context/CanvasContext';

import { canvasSchema } from '@/types/canvas';

export default function CreateCanvasForm() {
    const [open, setOpen] = useState(false);
    const { setCurrentCanvas, createCanvas } = useCanvasContext();

    const form = useForm<z.infer<typeof canvasSchema>>({
        resolver: zodResolver(canvasSchema),
        defaultValues: {
            problemName: '',
            problemUrl: '',
        },
    });
    function onSubmit(values: z.infer<typeof canvasSchema>) {
        setOpen(false);
        const newCanvas = createCanvas({
            ...values,
            problemUrl: values.problemUrl ?? '',
        });
        setCurrentCanvas(newCanvas);
        form.reset()
    }

    function onCancel() {
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button>
                    <Plus size={24} />
                </button>
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
                                        <Input placeholder="Problem Name" {...field} value={field.value ?? ''} />
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
                                        <Input placeholder="Problem URL" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button type="reset" onClick={onCancel}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}