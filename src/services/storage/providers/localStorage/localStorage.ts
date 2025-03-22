import { type StorageProvider, StorageType, type BaseStorage } from '@/types/storage'
import {
  StorageInitializationError,
  StorageNotInitializedError,
  StorageOperationError,
  CanvasNotFoundError,
  SerializationError,
} from '@/errors'
import { 
  type Canvas, 
  type CreateCanvas, 
  type UpdateCanvas, 
  type Idea, 
  type CreateIdea, 
  type UpdateIdea, 
  createEmptyCanvas,
  emptyIdea
} from '@/types/canvas'
import { STORAGE_KEYS } from './constants'


class LocalStorage implements BaseStorage {
  async get(key: string): Promise<string | null> {
    return localStorage.getItem(key)
  }

  async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value)
  }

  async delete(key: string): Promise<void> {
    localStorage.removeItem(key)
  }

  async clear(): Promise<void> {
    localStorage.clear()
  }
}

export class LocalStorageProvider implements StorageProvider {
  readonly type = StorageType.LOCAL
  private storage: BaseStorage
  private initializationPromise: Promise<void>
  private _isReady: boolean = false

  get isReady(): boolean {
    return this._isReady
  }

  constructor() {
    this.storage = new LocalStorage()
    this.initializationPromise = this.initialize()
  }
  

  private async initialize(): Promise<void> {
  try {
    await Promise.all([
      this.initializeCanvases(),
      this.initializeLastEdited()
    ])
    this._isReady = true
  } catch (error) {
    throw new StorageInitializationError(undefined, error)
  }
}

  private async initializeCanvases(): Promise<void> {
  const hasData = await this.storage.get(STORAGE_KEYS.CANVAS_DATA)
  if (!hasData) {
    await this.storage.set(STORAGE_KEYS.CANVAS_DATA, JSON.stringify([]))
  }
}

private async initializeLastEdited(): Promise<void> {
  const hasLastEdited = await this.storage.get(STORAGE_KEYS.LAST_EDITED_CANVAS)
  if (!hasLastEdited) {
    await this.storage.set(STORAGE_KEYS.LAST_EDITED_CANVAS, '')
  }
}

  // Helper methods
  private async ensureInitialized(): Promise<void> {
    await this.initializationPromise
    if (!this.isReady) {
      throw new StorageNotInitializedError()
    }
  }
  private async getCanvasOrThrow(id: string): Promise<Canvas> {
    const canvas = await this.getCanvas(id)
    if (!canvas) throw new CanvasNotFoundError(id)
    return canvas
  } 
  private convertDates(canvas: Canvas): Canvas {
  return {
    ...canvas,
    createdAt: new Date(canvas.createdAt),
    updatedAt: new Date(canvas.updatedAt)
  }
}

  private async getData<T>(key: string): Promise<T | null> {
    try {
      const data = await this.storage.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new SerializationError('deserialize', error)
      }
      throw new StorageOperationError('read', 'data', key, error)
    }
  }

  private async setData<T>(key: string, value: T): Promise<void> {
    try {
      await this.storage.set(key, JSON.stringify(value))
    } catch (error) {
      throw new StorageOperationError('write', 'data', key, error)
    }
  }

  // Canvas Operations
  async getCanvases(): Promise<Canvas[] | null> {
    await this.ensureInitialized()
    const canvases = await this.getData<Canvas[]>(STORAGE_KEYS.CANVAS_DATA)
    if (!canvases) return null
    return canvases.map(this.convertDates)
  }

  async getCanvas(id: string): Promise<Canvas | null> {
    await this.ensureInitialized()
    const canvases = await this.getCanvases()
    if (!canvases) return null
    return canvases.find(c => c.canvasId === id) || null
  }

  async createCanvas(data: CreateCanvas): Promise<Canvas> {
    await this.ensureInitialized()
    try {
      const newCanvas: Canvas = {
        ...createEmptyCanvas(),
        ...data,
        canvasId: data.canvasId ?? createEmptyCanvas().canvasId,
      }

      const canvases = await this.getCanvases() || []
      
      // Check if the canvas ID already exists
      if (canvases.some(c => c.canvasId === newCanvas.canvasId)) {
        throw new StorageOperationError('create', 'canvas', undefined, new Error('Canvas ID already exists'));
      }

      await this.setData(STORAGE_KEYS.CANVAS_DATA, [...canvases, newCanvas])
      await this.setLastEditedCanvasId(newCanvas.canvasId)
      return newCanvas
    } catch (error) {
      throw new StorageOperationError('create', 'canvas', undefined, error)
    }
  }

  async updateCanvas(id: string, updates: UpdateCanvas): Promise<void> {
    await this.ensureInitialized()
    await this.getCanvasOrThrow(id)

    const canvases = await this.getCanvases()
    if (!canvases) throw new StorageOperationError('read', 'canvases')
  
    // Add a small delay to ensure the new timestamp is greater
    await new Promise(resolve => setTimeout(resolve, 1))
  
    const updatedCanvases = canvases.map(c => 
      c.canvasId === id ? { 
        ...c, 
        ...updates, 
        updatedAt: new Date(),
        // Preserve existing fields if not provided in updates
        constraints: updates.constraints ?? c.constraints,
        code: updates.code ?? c.code,
        testCases: updates.testCases ?? c.testCases,
      } : c
    )

    await this.setData(STORAGE_KEYS.CANVAS_DATA, updatedCanvases)
    await this.setLastEditedCanvasId(id)
  }

  async deleteCanvas(id: string): Promise<void> {
    await this.ensureInitialized()
    await this.getCanvasOrThrow(id)

    const canvases = await this.getCanvases()
    if (!canvases) throw new StorageOperationError('read', 'canvases')

    const filteredCanvases = canvases.filter(canvas => canvas.canvasId !== id)
    await this.setData(STORAGE_KEYS.CANVAS_DATA, filteredCanvases)

    // Clean up last edited canvas if it was the deleted one
    const lastEdited = await this.getLastEditedCanvasId()
    if (lastEdited === id) {
      await this.setLastEditedCanvasId('')
    }
  }

  // Idea Operations
  async getIdeas(canvasId: string): Promise<Idea[] | null> {
    await this.ensureInitialized()
    const canvas = await this.getCanvas(canvasId)
    return canvas?.ideas || null
  }

  async addIdea(canvasId: string, idea: CreateIdea): Promise<void> {
    await this.ensureInitialized()
    const canvas = await this.getCanvasOrThrow(canvasId)
    
    const canvases = await this.getCanvases()
    if (!canvases) throw new StorageOperationError('read', 'canvases')
      
    const newIdea: Idea = {
      ...emptyIdea,
      ...idea,
    }

    const updatedCanvas = {
      ...canvas,
      ideas: [...canvas.ideas, newIdea],
      updatedAt: new Date()
    }

    const updatedCanvases = canvases.map(c => 
      c.canvasId === canvasId ? updatedCanvas : c
    )


    await this.setData(STORAGE_KEYS.CANVAS_DATA, updatedCanvases)  
    await this.setLastEditedCanvasId(canvasId)
  }

  async updateIdea(canvasId: string, ideaId: string, updates: UpdateIdea): Promise<void> {
    await this.ensureInitialized()
    await this.getCanvasOrThrow(canvasId)

    const canvases = await this.getCanvases()
    if (!canvases) throw new StorageOperationError('read', 'canvases')
    const updatedCanvases = canvases.map(canvas => {
        if (canvas.canvasId === canvasId) {
          return {
            ...canvas,
            ideas: canvas.ideas.map(idea => 
              idea.ideaId === ideaId 
                ? { ...idea, ...updates }
                : idea
            ),
            updatedAt: new Date()
          }
        }
        return canvas
    })
    
    await this.setData(STORAGE_KEYS.CANVAS_DATA, updatedCanvases)
    await this.setLastEditedCanvasId(canvasId)
  }

  async deleteIdea(canvasId: string, ideaId: string): Promise<void> {
    await this.ensureInitialized()
    await this.getCanvasOrThrow(canvasId)

    const canvases = await this.getCanvases()
    if (!canvases) throw new StorageOperationError('read', 'canvases')

    const updatedCanvases = canvases.map(canvas => {
        if (canvas.canvasId === canvasId) {
          return {
            ...canvas,
            ideas: canvas.ideas.filter(idea => idea.ideaId !== ideaId),
            updatedAt: new Date()
          }
      }
      return canvas
    })

    await this.setData(STORAGE_KEYS.CANVAS_DATA, updatedCanvases)
    await this.setLastEditedCanvasId(canvasId)
  }

  // Session Management
  async getLastEditedCanvasId(): Promise<string | null> {
    await this.ensureInitialized()
    return await this.storage.get(STORAGE_KEYS.LAST_EDITED_CANVAS)
  }

  async setLastEditedCanvasId(id: string): Promise<void> {
    await this.ensureInitialized()
    if (id !== '') {
      await this.getCanvasOrThrow(id)
    }
    try {
      await this.storage.set(STORAGE_KEYS.LAST_EDITED_CANVAS, id)
    } catch (error) {
      throw new StorageOperationError('write', 'lastEditedCanvasId', undefined, error)
    }
  }
}