/// <reference types="vite/client" />
import { StorageType } from '@/types/storage'

interface ImportMetaEnv {
    readonly VITE_STORAGE_TYPE: StorageType.LOCAL | StorageType.CRDT
}

interface ImportMeta {
    readonly env: ImportMetaEnv
} 