import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock URL.createObjectURL y URL.revokeObjectURL
globalThis.URL = globalThis.URL || {}
globalThis.URL.createObjectURL = vi.fn(() => 'blob:http://localhost:3000/mock-blob-id')
globalThis.URL.revokeObjectURL = vi.fn()

// Mock del objeto File si no existe
globalThis.File = globalThis.File || class File {
  constructor(chunks, filename, options = {}) {
    this.chunks = chunks
    this.name = filename
    this.size = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    this.type = options.type || ''
    this.lastModified = Date.now()
  }
}

// Mock de FileReader si es necesario
globalThis.FileReader = globalThis.FileReader || class FileReader {
  constructor() {
    this.result = null
    this.error = null
    this.readyState = 0
    this.onload = null
    this.onerror = null
  }

  readAsDataURL() {
    setTimeout(() => {
      this.result = 'data:image/jpeg;base64,mock-base64-data'
      this.readyState = 2
      if (this.onload) this.onload({ target: this })
    }, 100)
  }
}