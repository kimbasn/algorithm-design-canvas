import { type StorageProvider, StorageType } from '@/types/storage'
import { createStorageProvider } from './providers'
import type { CreateCanvas, UpdateCanvas, CreateIdea, UpdateIdea, Canvas } from '@/types/canvas'
import { StorageInitializationError } from '@/errors'

interface InitializableStorageProvider extends StorageProvider {
  initializationPromise: Promise<void>
}

let storageProvider: StorageProvider | null = null

export async function initializeStorage(type: StorageType = StorageType.LOCAL): Promise<void> {
  if (storageProvider) {
    return // Already initialized
  }
  
  try {
    storageProvider = createStorageProvider(type)
    // Wait for the provider to be ready
    await (storageProvider as InitializableStorageProvider).initializationPromise
  } catch (error) {
    throw new StorageInitializationError('Failed to initialize storage provider', error)
  }
}

export function getStorage(): StorageProvider {
  if (!storageProvider) {
    throw new StorageInitializationError('Storage not initialized')
  }
  return storageProvider
}

export function resetStorage() {
  storageProvider = null
}

export const storage = {
  getCanvases: () => getStorage().getCanvases(),
  createCanvas: (canvas: CreateCanvas) => getStorage().createCanvas(canvas),
  updateCanvas: (canvasId: string, updates: UpdateCanvas) => 
  getStorage().updateCanvas(canvasId, updates),
  deleteCanvas: (canvasId: string) => getStorage().deleteCanvas(canvasId),
  getCanvas: (canvasId: string) => getStorage().getCanvas(canvasId),
  importCanvases: (canvases: Canvas[]) => getStorage().importCanvases(canvases),
  exportCanvases: () => getStorage().exportCanvases(),
  
  getIdeas: (canvasId: string) => getStorage().getIdeas(canvasId),
  addIdea: (canvasId: string, idea: CreateIdea) => 
  getStorage().addIdea(canvasId, idea),
  updateIdea: (canvasId: string, ideaId: string, updates: UpdateIdea) => 
  getStorage().updateIdea(canvasId, ideaId, updates),
  deleteIdea: (canvasId: string, ideaId: string) => 
  getStorage().deleteIdea(canvasId, ideaId),
  getLastEditedCanvasId: () => getStorage().getLastEditedCanvasId(),
}