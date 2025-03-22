import { StorageType } from '@/types/storage'
import { LocalStorageProvider } from '../localStorage'
import { type Canvas, type CreateCanvas, type CreateIdea } from '@/types/canvas'
import { CanvasNotFoundError } from '@/errors'
// import { STORAGE_KEYS } from '../constants'

describe('LocalStorageProvider', () => {
  let provider: LocalStorageProvider
  let mockStorage: { [key: string]: string }
  
  // Mock implementation of localStorage
  beforeEach(() => {
    mockStorage = {}
    const mockLocalStorage = {
      getItem: jest.fn((key: string) => mockStorage[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        mockStorage[key] = value
      }),
      removeItem: jest.fn((key: string) => {
        delete mockStorage[key]
      }),
      clear: jest.fn(() => {
        mockStorage = {}
      }),
      length: Object.keys(mockStorage).length,
      key: jest.fn((index: number) => Object.keys(mockStorage)[index])
    }

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })

    provider = new LocalStorageProvider()
  })

  afterEach(() => {
    jest.clearAllMocks()
    mockStorage = {}
  })

  //Helper function to create a test canvas
  const createTestCanvas = async (data: Partial<CreateCanvas> = {}): Promise<Canvas> => {
    const createData: CreateCanvas = {
      problemName: 'Test Problem',
      problemUrl: 'https://test.com',
      ...data
    }
    return await provider.createCanvas(createData)
  }

  // Helper function to verify canvas properties
  const verifyCanvas = (actual: Canvas | null, expected: Canvas, options?: {
    checkTimestamps?: boolean,
    updatedAfter?: Date
  }) => {
    expect(actual).not.toBeNull()
    if (!actual) return // TypeScript null check

    // Verify all canvas properties
    expect(actual.canvasId).toBe(expected.canvasId)
    expect(actual.problemName).toBe(expected.problemName)
    expect(actual.problemUrl).toBe(expected.problemUrl)
    expect(actual.constraints).toBe(expected.constraints)
    expect(actual.testCases).toBe(expected.testCases)
    expect(actual.code).toBe(expected.code)
    expect(actual.ideas).toEqual(expected.ideas)

    // Verify timestamps if requested
    if (options?.checkTimestamps) {
      expect(actual.createdAt).toEqual(expected.createdAt)
      
      if (options.updatedAfter) {
        expect(actual.updatedAt.getTime()).toBeGreaterThan(options.updatedAfter.getTime())
      } else {
        expect(actual.updatedAt).toEqual(expected.updatedAt)
      }
    }
  }

  describe('Initialization', () => {
    it('should initialize with empty canvas array', async () => {
      const canvases = await provider.getCanvases()
      expect(canvases).toEqual([])
    })

    it('should initialize with empty last edited canvas ID', async () => {
      const lastEdited = await provider.getLastEditedCanvasId()
      expect(lastEdited).toBeNull()
    })

    it('should be ready immediately', () => {
      expect(provider.isReady).toBe(true)
    })

    it('should have correct storage type', () => {
      expect(provider.type).toBe(StorageType.LOCAL)
    })
  })

  describe('Canvas Operations', () => {
    describe('createCanvas', () => {
      it('should create a new canvas with correct structure', async () => {
        const canvas = await createTestCanvas()
        
        expect(canvas).toMatchObject({
          problemName: 'Test Problem',
          problemUrl: 'https://test.com',
          ideas: [],
          constraints: '',
          testCases: '',
          code: '',
        })
        expect(canvas.canvasId).toBeDefined()
        expect(canvas.createdAt).toBeInstanceOf(Date)
        expect(canvas.updatedAt).toBeInstanceOf(Date)
      })

      it('should store the canvas in localStorage', async () => {
        const canvas = await createTestCanvas()
        const storedCanvases = await provider.getCanvases()

        expect(storedCanvases).toHaveLength(1)
        expect(storedCanvases![0].canvasId).toBe(canvas.canvasId)
      })

      it('should set last edited canvas ID when a new canvas is created', async () => {
        const canvas = await createTestCanvas()
        const lastEdited = await provider.getLastEditedCanvasId()
        expect(lastEdited).toBe(canvas.canvasId)
      })
    })

    describe('getCanvas', () => {
      it('should return null for non-existent canvas', async () => {
        const canvas = await provider.getCanvas('non-existent')
        expect(canvas).toBeNull()
      })

      it('should return correct canvas by ID', async () => {
        const created = await createTestCanvas()
        const retrieved = await provider.getCanvas(created.canvasId)

        verifyCanvas(retrieved, created)
      })
    })

    describe('updateCanvas', () => {
      it('should update canvas properties', async () => {
        const canvas = await createTestCanvas()
        const updates = {
          problemName: 'Updated Problem',
          constraints: 'New constraint'
        }

        await provider.updateCanvas(canvas.canvasId, updates)
        const updated = await provider.getCanvas(canvas.canvasId)

        verifyCanvas(updated, {
          ...canvas,
          ...updates,
        }, {
          checkTimestamps: true,
          updatedAfter: canvas.updatedAt
        })
      })

      it('should handle non-existent canvas gracefully', async () => {
        await expect(
          provider.updateCanvas('non-existent', { problemName: 'Test' })
        ).rejects.toThrow(CanvasNotFoundError)
      })
    })

    describe('deleteCanvas', () => {
      it('should delete canvas', async () => {
        const canvas = await createTestCanvas()
        await provider.deleteCanvas(canvas.canvasId)

        const retrieved = await provider.getCanvas(canvas.canvasId)
        expect(retrieved).toBeNull()
      })

      it('should update last edited canvas if deleted canvas was last edited', async () => {
        const canvas = await createTestCanvas()
        await provider.setLastEditedCanvasId(canvas.canvasId)
        await provider.deleteCanvas(canvas.canvasId)

        const lastEdited = await provider.getLastEditedCanvasId()
        expect(lastEdited).toBeNull()
      })
    })
  })

  describe('Idea Operations', () => {
    let testCanvas: Canvas

    beforeEach(async () => {
      testCanvas = await createTestCanvas()
    })

    describe('addIdea', () => {
      it('should add idea to canvas', async () => {
        const idea: CreateIdea = {
          description: 'Test Idea',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)'
        }

        await provider.addIdea(testCanvas.canvasId, idea)
        const canvas = await provider.getCanvas(testCanvas.canvasId)

        expect(canvas!.ideas).toHaveLength(1)
        expect(canvas!.ideas[0]).toMatchObject(idea)
        expect(canvas!.ideas[0].ideaId).toBeDefined()
      })

      it('should handle adding idea to non-existent canvas', async () => {
        const idea: CreateIdea = {
          description: 'Test Idea',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)'
        }

        await expect(
          provider.addIdea('non-existent', idea)
        ).rejects.toThrow(CanvasNotFoundError)
      })
    })

    describe('updateIdea', () => {
      it('should update existing idea', async () => {
        const idea: CreateIdea = {
          description: 'Original Idea',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)'
        }

        await provider.addIdea(testCanvas.canvasId, idea)
        const canvas = await provider.getCanvas(testCanvas.canvasId)
        const ideaId = canvas!.ideas[0].ideaId

        await provider.updateIdea(testCanvas.canvasId, ideaId, {
          description: 'Updated Idea'
        })

        const updated = await provider.getCanvas(testCanvas.canvasId)
        expect(updated!.ideas[0].description).toBe('Updated Idea')
      })
    })

    describe('deleteIdea', () => {
      it('should delete idea from canvas', async () => {
        const idea: CreateIdea = {
          description: 'Test Idea',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)'
        }

        await provider.addIdea(testCanvas.canvasId, idea)
        const canvas = await provider.getCanvas(testCanvas.canvasId)
        const ideaId = canvas!.ideas[0].ideaId

        await provider.deleteIdea(testCanvas.canvasId, ideaId)
        const updated = await provider.getCanvas(testCanvas.canvasId)

        expect(updated!.ideas).toHaveLength(0)
      })
    })
    

    describe('Session Management', () => {
      it('should manage last edited canvas ID', async () => {
        const canvas = await createTestCanvas()
        await provider.setLastEditedCanvasId(canvas.canvasId)

        const lastEdited = await provider.getLastEditedCanvasId()
        expect(lastEdited).toBe(canvas.canvasId)
      })
    })

    // describe('Error Handling', () => {
    //   it('should handle localStorage failures', async () => {
    //     jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
    //       throw new StorageInitializationError()
    //     })

    //     await expect(provider.getCanvases()).rejects.toThrow(StorageInitializationError)
    //   })

    //   it('should handle invalid JSON data', async () => {
    //     await provider.getCanvases()

    //     localStorage.setItem(STORAGE_KEYS.CANVAS_DATA, 'invalid json')

    //     await expect(provider.getCanvases()).rejects.toThrow(StorageInitializationError)
    //   })
    // })

    describe('Data Integrity', () => {
      it('should maintain data consistency across operations', async () => {
        // Create canvas
        const canvas = await createTestCanvas()

        // Add idea
        await provider.addIdea(canvas.canvasId, {
          description: 'Test Idea',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)'
        })

        // Update canvas
        await provider.updateCanvas(canvas.canvasId, {
          problemName: 'Updated Problem'
        })

        // Verify final state
        const finalCanvas = await provider.getCanvas(canvas.canvasId)
        expect(finalCanvas).toMatchObject({
          problemName: 'Updated Problem',
          ideas: expect.arrayContaining([
            expect.objectContaining({
              description: 'Test Idea'
            })
          ])
        })
      })
    })
  })
})