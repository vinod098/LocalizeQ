// LocalizeQ uses frontend-only storage
// This file is minimal since all data is handled client-side

export interface IStorage {
  // No backend storage needed for LocalizeQ
  // All translations and cultures are managed in React state
}

export class MemStorage implements IStorage {
  constructor() {
    // No backend storage needed
  }
}

export const storage = new MemStorage();