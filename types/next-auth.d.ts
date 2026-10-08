import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'TECHNICIAN' | 'PRODUCTION' | 'ADMIN'
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: 'TECHNICIAN' | 'PRODUCTION' | 'ADMIN'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'TECHNICIAN' | 'PRODUCTION' | 'ADMIN'
  }
}
