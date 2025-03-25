import { type StorageProvider, StorageType, type BaseStorage } from '@/types/storage'
import {
  StorageInitializationError,
  StorageNotInitializedError,
  StorageOperationError,
  CanvasNotFoundError,
} from '@/errors'
import { 
  type Canvas, 
  type CreateCanvas, 
  type UpdateCanvas, 
  type Idea, 
  type CreateIdea, 
  type UpdateIdea, 
  createEmptyCanvas,
  createEmptyIdea,
} from '@/types/canvas'
import { STORAGE_KEYS } from './constants'
//import { debounce } from 'lodash'


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

/**
 * LocalStorageProvider implements the StorageProvider interface
 * using browser's localStorage with in-memory caching for better performance.
 * 
 * Features:
 * - In-memory caching of canvases
 * - Debounced storage updates
 * - Retry mechanism for failed operations
 * - Type-safe operations
 */
export class LocalStorageProvider implements StorageProvider {
  readonly type = StorageType.LOCAL
  private storage: BaseStorage
  private initializationPromise: Promise<void>
  private _isReady: boolean = false
  private canvases: Canvas[] = [] // In-memory cache of canvases

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
    const storedData = await this.storage.get(STORAGE_KEYS.CANVAS_DATA)
    if (!storedData) {
      this.canvases = []
      await this.storage.set(STORAGE_KEYS.CANVAS_DATA, JSON.stringify([]))
    } else {
      this.canvases = JSON.parse(storedData).map(this.convertDates)
    }
  }

  private async initializeLastEdited(): Promise<void> {
    const hasLastEdited = await this.storage.get(STORAGE_KEYS.LAST_EDITED_CANVAS)
    if (!hasLastEdited) { // TODO: find most recently updated canvas
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

  private getCanvasOrThrow(id: string): Canvas {
    const canvas = this.canvases.find(c => c.canvasId === id)
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

  /**
 * Helper function to find the most recently edited canvas
 */
  private findLastEditedCanvas(): Canvas | null {
    if (this.canvases.length === 0) return null
    return this.canvases.reduce((mostRecent, current) => {
        if (!mostRecent) return current
        return current.updatedAt > mostRecent.updatedAt ? current : mostRecent
    }, this.canvases[0])
  }

  // private async getData<T>(key: string): Promise<T | null> {
  //   try {
  //     const data = await this.storage.get(key)
  //     return data ? JSON.parse(data) : null
  //   } catch (error) {
  //     if (error instanceof SyntaxError) {
  //       throw new SerializationError('deserialize', error)
  //     }
  //     throw new StorageOperationError('read', 'data', key, error)
  //   }
  // }

  // private async setData<T>(key: string, value: T): Promise<void> {
  //   try {
  //     await this.storage.set(key, JSON.stringify(value))
  //   } catch (error) {
  //     throw new StorageOperationError('write', 'data', key, error)
  //   }
  // }

  private async setDataWithRetry<T>(key: string, value: T, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.storage.set(key, JSON.stringify(value))
        return
      } catch (error) {
        if (i === retries - 1) throw error
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, i)))
      }
    }
  }

  private async saveToStorage(): Promise<void> {
    await this.setDataWithRetry(STORAGE_KEYS.CANVAS_DATA, this.canvases)
  }

  // private debouncedSave = debounce(async () => {
  //   await this.saveToStorage()
  // }, 1000)

  // private validateCanvas(canvas: Canvas): void {
  //   if (!canvas.canvasId) { // TODO: check if canvasId is a valid UUID
  //     throw new StorageOperationError('create', 'canvas', 'Canvas ID is required')
  //   }
  //   if (!canvas.problemName) {
  //     throw new StorageOperationError('create', 'canvas', 'Problem name is required')
  //   }
  //   if (!(canvas.createdAt instanceof Date)) {
  //     throw new StorageOperationError('create', 'canvas', 'Invalid creation date')
  //   }
  //   if (!(canvas.updatedAt instanceof Date)) {
  //     throw new StorageOperationError('create', 'canvas', 'Invalid update date')
  //   }
  // }

  async updateCanvas(id: string, updates: UpdateCanvas): Promise<void> {
    await this.ensureInitialized()
    this.getCanvasOrThrow(id)

    // Add a small delay to ensure the new timestamp is greater
    await new Promise(resolve => setTimeout(resolve, 1))

    this.canvases = this.canvases.map(c => 
      c.canvasId === id ? { 
        ...c, 
        ...updates, 
        updatedAt: new Date(),
        constraints: updates.constraints ?? c.constraints,
        code: updates.code ?? c.code,
        testCases: updates.testCases ?? c.testCases,
      } : c
    )

    this.saveToStorage()
    await this.setLastEditedCanvasId(id)
  }

  async cleanup(): Promise<void> {
    try {
      this.canvases = []
      this._isReady = false
      await this.storage.clear()
    } catch (error) {
      throw new StorageOperationError('cleanup', 'storage', undefined, error)
    }
  }

  // Canvas Operations
  async getCanvases(): Promise<Canvas[] | null> {
    await this.ensureInitialized()
    return this.canvases
  }

  async importCanvases(canvases: Canvas[]): Promise<{
    imported: Canvas[],
    duplicates: Array<{
      original: Canvas,
      duplicate: Canvas
    }>
  }> {
    await this.ensureInitialized()
    
    const result = {
      imported: [] as Canvas[],
      duplicates: [] as Array<{ original: Canvas, duplicate: Canvas }>
    }

    for (const canvas of canvases) { // TODO: Validate canvas
      const newCanvas = {
        ...createEmptyCanvas(),
        ...canvas,
        canvasId: canvas.canvasId ?? createEmptyCanvas().canvasId
      }

      // Check for duplicates by canvasId
      const existingCanvas = this.canvases.find(c => c.canvasId === newCanvas.canvasId)
      
      if (existingCanvas) {
        result.duplicates.push({
          original: existingCanvas,
          duplicate: newCanvas
        })
        continue
      }

      // Check for potential duplicates by problem name
      const nameDuplicate = this.canvases.find(c => 
        c.problemName.toLowerCase() === newCanvas.problemName.toLowerCase()
      )

      if (nameDuplicate) {
        result.duplicates.push({
          original: nameDuplicate,
          duplicate: newCanvas
        })
        continue
      }

      // If no duplicates found, add to canvases
      this.canvases.push(newCanvas)
      result.imported.push(newCanvas)
    }

    // Only save if we actually imported something
    if (result.imported.length > 0) {
      this.saveToStorage()
    }

    return result
  }

  async exportCanvases(): Promise<Canvas[]> {
    await this.ensureInitialized()
    return this.canvases.map(canvas => ({
      ...canvas,
      createdAt: new Date(canvas.createdAt),
      updatedAt: new Date(canvas.updatedAt)
    }))
  }

  async getCanvas(id: string): Promise<Canvas | null> {
    await this.ensureInitialized()
    return this.canvases.find(c => c.canvasId === id) || null
  }

  async createCanvas(data: CreateCanvas): Promise<Canvas> {
    await this.ensureInitialized()
    try {
      const newCanvas: Canvas = {
        ...createEmptyCanvas(),
        ...data,
        canvasId: data.canvasId ?? createEmptyCanvas().canvasId,
      }

      // Check if the canvas ID already exists
      if (this.canvases.some(c => c.canvasId === newCanvas.canvasId)) {
        throw new StorageOperationError('create', 'canvas', undefined, new Error('Canvas ID already exists'))
      }

      this.canvases = [...this.canvases, newCanvas]
      this.saveToStorage()
      await this.setLastEditedCanvasId(newCanvas.canvasId)
      return newCanvas
    } catch (error) {
      throw new StorageOperationError('create', 'canvas', undefined, error)
    }
  }

  async deleteCanvas(id: string): Promise<void> {
    await this.ensureInitialized()
    this.getCanvasOrThrow(id)

    this.canvases = this.canvases.filter(canvas => canvas.canvasId !== id)
    this.saveToStorage()

    // Clean up last edited canvas if it was the deleted one
    const lastEdited = await this.getLastEditedCanvasId()
    if (lastEdited === id) {
      const nextCanvas = this.findLastEditedCanvas()
      if (nextCanvas) {
        await this.setLastEditedCanvasId(nextCanvas.canvasId)
      } else {
        await this.setLastEditedCanvasId('')
      }
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
    this.getCanvasOrThrow(canvasId)
      
    const newIdea: Idea = {
      ...createEmptyIdea(),
      ...idea,
    }

    this.canvases = this.canvases.map(c => 
      c.canvasId === canvasId ? {
        ...c,
        ideas: [...c.ideas, newIdea],
        updatedAt: new Date()
      } : c
    )

    this.saveToStorage()
    await this.setLastEditedCanvasId(canvasId)
  }

  async updateIdea(canvasId: string, ideaId: string, updates: UpdateIdea): Promise<void> {
    await this.ensureInitialized()
    this.getCanvasOrThrow(canvasId)

    this.canvases = this.canvases.map(canvas => {
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
    
    this.saveToStorage()
    await this.setLastEditedCanvasId(canvasId)
  }

  async deleteIdea(canvasId: string, ideaId: string): Promise<void> {
    await this.ensureInitialized()
    this.getCanvasOrThrow(canvasId)

    this.canvases = this.canvases.map(canvas => {
      if (canvas.canvasId === canvasId) {
        return {
          ...canvas,
          ideas: canvas.ideas.filter(idea => idea.ideaId !== ideaId),
          updatedAt: new Date()
        }
      }
      return canvas
    })

    this.saveToStorage()
    await this.setLastEditedCanvasId(canvasId)
  }

  // Session Management
  async getLastEditedCanvasId(): Promise<string | null> {
    await this.ensureInitialized()
    return await this.storage.get(STORAGE_KEYS.LAST_EDITED_CANVAS)
  }

  private async setLastEditedCanvasId(id: string): Promise<void> {
    await this.ensureInitialized()
    if (id !== '') {
      this.getCanvasOrThrow(id)
    }
    try {
      await this.storage.set(STORAGE_KEYS.LAST_EDITED_CANVAS, id)
    } catch (error) {
      throw new StorageOperationError('write', 'lastEditedCanvasId', undefined, error)
    }
  }
}