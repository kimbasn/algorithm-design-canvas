"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useCanvasContext } from '@/context/CanvasContext';
import { Upload, ArrowUpDown, CheckCircle2, XCircle } from 'lucide-react';
import { type Language } from '@/types/canvas';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

type Canvas = {
    code: string;
    canvasId: string;
    problemName: string;
    updatedAt: Date;
    createdAt: Date;
    constraints: string;
    ideas: {
        description: string;
        timeComplexity: string;
        spaceComplexity: string;
        ideaId: string;
    }[];
    testCases: string;
    language: Language;
    problemUrl?: string;
};

type ImportResult = {
    canvasId: string;
    problemName: string;
    status: 'success' | 'failed';
    message?: string;
};

const columns: ColumnDef<Canvas>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "problemName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Problem Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Updated
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return new Date(row.getValue("updatedAt")).toLocaleDateString();
        },
    },
];

const resultColumns: ColumnDef<ImportResult>[] = [
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as 'success' | 'failed';
            return (
                <div className="flex items-center">
                    {status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span className="capitalize">{status}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "problemName",
        header: "Problem Name",
    },
    {
        accessorKey: "message",
        header: "Message",
        cell: ({ row }) => {
            const message = row.getValue("message") as string;
            return message ? (
                <span className="text-sm text-muted-foreground">{message}</span>
            ) : null;
        },
    },
];

export function ImportCanvas() {
    const [open, setOpen] = useState(false);
    const [importResults, setImportResults] = useState<ImportResult[]>([]);
    const [availableCanvases, setAvailableCanvases] = useState<Canvas[]>([]);
    const { importCanvases } = useCanvasContext();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            setAvailableCanvases(data);
            setImportResults([]);
        } catch (error) {
            toast.error("Error", {
                description: "Failed to read file. Please check the file format.",
            });
        }

        // Reset the input
        event.target.value = '';
    };

    const handleImport = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        if (selectedRows.length === 0) {
            toast.error("Error", {
                description: "Please select at least one canvas to import.",
            });
            return;
        }

        try {
            const selectedData = selectedRows.map(row => row.original);
            const { duplicates: duplicatesCanvases } = await importCanvases(selectedData);

            // Create import results
            const results: ImportResult[] = selectedData.map(canvas => {
                const isDuplicate = duplicatesCanvases?.some(d => d.canvasId === canvas.canvasId);
                return {
                    canvasId: canvas.canvasId,
                    problemName: canvas.problemName,
                    status: isDuplicate ? 'failed' : 'success',
                    message: isDuplicate ? 'Canvas already exists' : 'Successfully imported',
                };
            });

            setImportResults(results);
            setAvailableCanvases([]);
        } catch (error) {
            toast.error("Error", {
                description: "Failed to import canvases. Please try again.",
            });
        }
    };

    const table = useReactTable({
        data: availableCanvases,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    const resultTable = useReactTable({
        data: importResults,
        columns: resultColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Import Canvases</DialogTitle>
                </DialogHeader>

                {importResults.length > 0 ? (
                    <div className="space-y-4">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {resultTable.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {resultTable.getRowModel().rows?.length ? (
                                        resultTable.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={resultColumns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => {
                                setImportResults([]);
                                setOpen(false);
                            }}>
                                Close
                            </Button>
                        </div>
                    </div>
                ) : availableCanvases.length > 0 ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Input
                                placeholder="Filter by problem name..."
                                value={(table.getColumn("problemName")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("problemName")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setAvailableCanvases([]);
                                    setOpen(false);
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex-1 text-sm text-muted-foreground">
                                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                                {table.getFilteredRowModel().rows.length} row(s) selected.
                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setAvailableCanvases([]);
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleImport}>
                                Import Selected
                            </Button>
                        </div>
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