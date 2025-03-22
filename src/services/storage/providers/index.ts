import { type StorageProvider, StorageType } from '@/types/storage'
import { LocalStorageProvider } from '@/services/storage/providers/localStorage/localStorage'


export function createStorageProvider(type: StorageType): StorageProvider {
  switch (type) {
    case StorageType.LOCAL:
      return new LocalStorageProvider()
    case StorageType.CRDT:
      throw new Error('CRDT storage provider not implemented yet')
    default:
      throw new Error(`Unsupported storage type: ${type}`)
  }
}