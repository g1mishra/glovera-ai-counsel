import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'student' | 'admin';
    } & DefaultSession['user'];
  }

  interface User {
    role?: 'student' | 'admin';
  }
} 