import { type Canvas, type CreateCanvas, type CreateIdea, type Idea, type UpdateCanvas, type UpdateIdea } from '@/types/canvas'

export enum StorageType {
  LOCAL = 'local',
  CRDT = 'crdt',
}

export interface BaseStorage {
    get(key: string): Promise<string | null>
    set(key: string, value: string): Promise<void>
    delete(key: string): Promise<void>
    clear(): Promise<void>
}

// Main storage provider interface
export interface StorageProvider {
  readonly type: StorageType

  // Core data operations
  // getData<T>(key: string): Promise<T | null>
  // setData<T>(key: string, value: T): Promise<void>
  
  // Canvas specific operations
  getCanvases(): Promise<Canvas[] | null>
  getCanvas(id: string): Promise<Canvas | null>
  createCanvas(data: CreateCanvas): Promise<Canvas>
  updateCanvas(id: string, data: UpdateCanvas): Promise<void>
  deleteCanvas(id: string): Promise<void>
  
  // Idea operations
  getIdeas(canvasId: string): Promise<Idea[] | null>
  addIdea(canvasId: string, idea: CreateIdea): Promise<void>
  updateIdea(canvasId: string, ideaId: string, data: UpdateIdea): Promise<void>
  deleteIdea(canvasId: string, ideaId: string): Promise<void>
  
  // Session management
  getLastEditedCanvasId(): Promise<string | null>
  //private setLastEditedCanvasId(id: string): Promise<void>
}