import { users } from "@shared/schema";

export interface IStorage {
  // Minimal storage interface required by the architecture
  healthCheck(): Promise<boolean>;
}

export class MemStorage implements IStorage {
  async healthCheck(): Promise<boolean> {
    return true;
  }
}

export const storage = new MemStorage();
