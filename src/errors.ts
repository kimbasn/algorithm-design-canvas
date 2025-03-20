// Base error class for all application errors
export class AppError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message)
    this.name = this.constructor.name
    // Maintains proper stack trace in modern JS engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

// Storage related errors
export class StorageError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, cause)
  }
}

export class StorageInitializationError extends StorageError {
  constructor(message: string = 'Failed to initialize storage', cause?: unknown) {
    super(message, cause)
  }
}

export class StorageNotInitializedError extends StorageError {
  constructor(message: string = 'Storage not initialized') {
    super(message)
  }
}

export class StorageOperationError extends StorageError {
  constructor(
    public operation: string,
    public entityType: string,
    public entityId?: string,
    cause?: unknown
  ) {
    const message = entityId 
      ? `Failed to ${operation} ${entityType}: ${entityId}`
      : `Failed to ${operation} ${entityType}`
    super(message, cause)
  }
}

// Canvas specific errors
export class CanvasNotFoundError extends StorageError {
  constructor(canvasId: string) {
    super(`Canvas not found: ${canvasId}`)
  }
}

export class CanvasValidationError extends StorageError {
  constructor(message: string, cause?: unknown) {
    super(message, cause)
  }
}

// Idea specific errors
export class IdeaNotFoundError extends StorageError {
  constructor(ideaId: string, canvasId: string) {
    super(`Idea not found: ${ideaId} in canvas: ${canvasId}`)
  }
}

export class IdeaValidationError extends StorageError {
  constructor(message: string, cause?: unknown) {
    super(message, cause)
  }
}

// Data serialization errors
export class SerializationError extends StorageError {
  constructor(operation: 'serialize' | 'deserialize', cause?: unknown) {
    super(`Failed to ${operation} data`, cause)
  }
}

export class ValidationError extends StorageError {
  constructor(message: string, cause?: unknown) {
    super(message, cause)
  }
}

// Quota errors
export class StorageQuotaError extends StorageError {
  constructor(message: string = 'Storage quota exceeded') {
    super(message)
  }
}