import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { type Canvas, type CreateCanvas, type CreateIdea, type UpdateCanvas, type UpdateIdea } from '@/types/canvas'
import { storage } from '@/services/storage'
import { StorageInitializationError } from '@/errors'

interface CanvasContextProps {
    canvases: Canvas[]
    currentCanvas: Canvas | null
    setCurrentCanvas: (canvas: Canvas | null) => void
    createCanvas: (data: CreateCanvas) => Promise<Canvas>
    updateCanvas: (id: string, updates: UpdateCanvas) => Promise<void>
    deleteCanvas: (id: string) => Promise<void>
    addIdea: (canvasId: string, idea: CreateIdea) => Promise<void>
    updateIdea: (canvasId: string, ideaId: string, updates: UpdateIdea) => Promise<void>
    deleteIdea: (canvasId: string, ideaId: string) => Promise<void>
    getLastEditedCanvas: () => Promise<Canvas | null>
    getCanvas: (id: string) => Promise<Canvas | null>
    importCanvases: (data: Canvas[]) => Promise<{ totalImported: number, duplicates: Canvas[] }>
    exportCanvases: () => Promise<Canvas[]>
    loading: boolean
    error: string | null
}

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined)



export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }): React.ReactElement => {
    const [canvases, setCanvases] = useState<Canvas[]>([])
    const [currentCanvas, setCurrentCanvas] = useState<Canvas | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [, setIsInitialized] = useState(false)

    // Initialize state from storage
    useEffect(() => {
        const initializeState = async () => {
            try {
                setLoading(true)
                setError(null)

                // Get saved canvases
                const savedCanvases = await storage.getCanvases()
                setCanvases(savedCanvases || [])

                // Get last edited canvas
                const lastEditedId = await storage.getLastEditedCanvasId()
                if (lastEditedId) {
                    const lastEditedCanvas = await storage.getCanvas(lastEditedId)
                    if (lastEditedCanvas) {
                        setCurrentCanvas(lastEditedCanvas)
                    }
                }

                setIsInitialized(true)
            } catch (err) {
                console.error('Error initializing state:', err)
                setError(err instanceof StorageInitializationError
                    ? 'Storage initialization failed'
                    : 'Failed to load canvases'
                )
            } finally {
                setLoading(false)
            }
        }

        initializeState()
    }, [])

    const createCanvas = useCallback(async (data: CreateCanvas): Promise<Canvas> => {
        try {
            const newCanvas = await storage.createCanvas(data)
            setCanvases(await storage.getCanvases() || [])
            // Set the current canvas immediately after creation
            setCurrentCanvas(newCanvas)
            return newCanvas
        } catch (err) {
            console.error('Error creating canvas:', err)
            setError('Failed to create canvas')
            throw err
        }
    }, [])

    const importCanvases = useCallback(async (data: Canvas[]): Promise<{ totalImported: number, duplicates: Canvas[] }> => {
        try {
            const { totalImported, duplicates } = await storage.importCanvases(data);
            setCanvases(await storage.getCanvases() || []);
            return { totalImported, duplicates };
        } catch (err) {
            console.error('Error importing canvases:', err);
            setError('Failed to import canvases');
            throw err;
        }
    }, []);

    const updateCanvas = useCallback(async (id: string, updates: UpdateCanvas): Promise<void> => {
        try {
            await storage.updateCanvas(id, updates)
            const updatedCanvas = await storage.getCanvas(id)
            if (!updatedCanvas) throw new Error('Canvas not found after update')

            setCanvases(await storage.getCanvases() || [])

            if (currentCanvas?.canvasId === id) {
                setCurrentCanvas(updatedCanvas)
            }
        } catch (err) {
            console.error('Error updating canvas:', err)
            setError('Failed to update canvas')
            throw err
        }
    }, [currentCanvas])

    const deleteCanvas = useCallback(async (id: string): Promise<void> => {
        try {
            // If we're deleting the current canvas, handle navigation first
            if (currentCanvas?.canvasId === id) {
                setCurrentCanvas(null);
                await storage.deleteCanvas(id);
                const remaining = await storage.getCanvases() || [];
                setCanvases(remaining);

                // If there are remaining canvases, select the last edited one
                if (remaining.length > 0) {
                    const lastEditedId = await storage.getLastEditedCanvasId();
                    if (lastEditedId) {
                        const lastEditedCanvas = await storage.getCanvas(lastEditedId);
                        if (lastEditedCanvas) {
                            setCurrentCanvas(lastEditedCanvas);
                        }
                    } else {
                        // If no last edited canvas, select the first remaining one
                        setCurrentCanvas(remaining[0]);
                    }
                }
            } else {
                // If we're not deleting the current canvas, just update state
                await storage.deleteCanvas(id);
                setCanvases(await storage.getCanvases() || []);
            }
        } catch (err) {
            console.error('Error deleting canvas:', err);
            setError('Failed to delete canvas');
            throw err;
        }
    }, [currentCanvas]);

    const addIdea = useCallback(async (canvasId: string, idea: CreateIdea): Promise<void> => {
        try {
            await storage.addIdea(canvasId, idea)
            const updatedCanvas = await storage.getCanvas(canvasId)
            if (!updatedCanvas) throw new Error('Canvas not found after adding idea')

            setCanvases(prev =>
                prev.map(canvas =>
                    canvas.canvasId === canvasId ? updatedCanvas : canvas
                )
            )

            if (currentCanvas?.canvasId === canvasId) {
                setCurrentCanvas(updatedCanvas)
            }
        } catch (err) {
            console.error('Error adding idea:', err)
            setError('Failed to add idea')
            throw err
        }
    }, [currentCanvas])

    const updateIdea = useCallback(async (canvasId: string, ideaId: string, updates: UpdateIdea): Promise<void> => {
        try {
            await storage.updateIdea(canvasId, ideaId, updates)
            const updatedCanvas = await storage.getCanvas(canvasId)
            if (!updatedCanvas) throw new Error('Canvas not found after updating idea')

            setCanvases(prev =>
                prev.map(canvas =>
                    canvas.canvasId === canvasId ? updatedCanvas : canvas
                )
            )

            if (currentCanvas?.canvasId === canvasId) {
                setCurrentCanvas(updatedCanvas)
            }
        } catch (err) {
            console.error('Error updating idea:', err)
            setError('Failed to update idea')
            throw err
        }
    }, [currentCanvas])

    const deleteIdea = useCallback(async (canvasId: string, ideaId: string): Promise<void> => {
        try {
            await storage.deleteIdea(canvasId, ideaId)
            const updatedCanvas = await storage.getCanvas(canvasId)
            if (!updatedCanvas) throw new Error('Canvas not found after deleting idea')

            setCanvases(prev =>
                prev.map(canvas =>
                    canvas.canvasId === canvasId ? updatedCanvas : canvas
                )
            )

            if (currentCanvas?.canvasId === canvasId) {
                setCurrentCanvas(updatedCanvas)
            }
        } catch (err) {
            console.error('Error deleting idea:', err)
            setError('Failed to delete idea')
            throw err
        }
    }, [currentCanvas])

    const getLastEditedCanvas = useCallback(async (): Promise<Canvas | null> => {
        try {
            const lastEditedId = await storage.getLastEditedCanvasId()
            if (!lastEditedId) return null
            return await storage.getCanvas(lastEditedId)
        } catch (err) {
            console.error('Error getting last edited canvas:', err)
            setError('Failed to get last edited canvas')
            return null
        }
    }, [])

    const getCanvas = useCallback(async (id: string): Promise<Canvas | null> => {
        try {
            return await storage.getCanvas(id)
        } catch (err) {
            console.error('Error getting canvas:', err)
            setError('Failed to get canvas')
            throw err
        }
    }, [])

    const exportCanvases = useCallback(async (): Promise<Canvas[]> => {
        try {
            return await storage.exportCanvases();
        } catch (err) {
            console.error('Error exporting canvases:', err);
            setError('Failed to export canvases');
            throw err;
        }
    }, []);

    const value = {
        canvases,
        currentCanvas,
        setCurrentCanvas,
        createCanvas,
        updateCanvas,
        deleteCanvas,
        addIdea,
        updateIdea,
        deleteIdea,
        getLastEditedCanvas,
        getCanvas,
        importCanvases,
        exportCanvases,
        loading,
        error
    }

    return (
        <CanvasContext.Provider value={value}>
            {children}
        </CanvasContext.Provider>
    )
}

/**
 * Custom hook to use the Canvas context
 * @throws {Error} If used outside of a CanvasProvider
 */
export const useCanvasContext = () => {
    const context = useContext(CanvasContext)
    if (context === undefined) {
        throw new Error('useCanvasContext must be used within a CanvasProvider')
    }
    return context
}