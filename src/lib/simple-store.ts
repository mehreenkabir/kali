// FILE: src/lib/simple-store.ts
// Simple in-memory data store for development/testing
// Replace with proper database in production

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  image?: string;
}

// Global user store
const globalUsers: User[] = [];

export const userStore = {
  // Get all users
  getAll(): User[] {
    return globalUsers;
  },

  // Find user by email
  findByEmail(email: string): User | undefined {
    return globalUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  },

  // Find user by ID
  findById(id: string): User | undefined {
    return globalUsers.find(user => user.id === id);
  },

  // Add new user
  create(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      email: userData.email.toLowerCase(),
    };
    
    globalUsers.push(newUser);
    console.log(`✅ User created: ${newUser.email} (Total: ${globalUsers.length})`);
    return newUser;
  },

  // Get user count
  count(): number {
    return globalUsers.length;
  }
};
