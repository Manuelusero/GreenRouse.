import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import Usuario from '@/models/Usuario'

// Importar tipos correctos de NextAuth
import type { DefaultSession } from 'next-auth'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        action: { label: 'Action', type: 'text' } // 'login' or 'register'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos')
        }

        await connectDB()

        try {
          // Acción de registro
          if (credentials.action === 'register') {
            // Verificar si el usuario ya existe
            const existingUser = await Usuario.findOne({ 
              email: credentials.email.toLowerCase() 
            })
            
            if (existingUser) {
              throw new Error('Ya existe una cuenta con este email')
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(credentials.password, 12)

            // Crear nuevo usuario
            const newUser = await Usuario.create({
              email: credentials.email.toLowerCase(),
              nombre: credentials.email.split('@')[0], // Nombre temporal basado en email
              password: hashedPassword,
              experiencia: 'principiante',
              espacio: 'balcon',
              ubicacion: 'sol',
              objetivos: ['hobby'],
              tiempo: 'poco'
            })

            return {
              id: newUser._id.toString(),
              email: newUser.email,
              name: newUser.nombre,
              image: null
            }
          }
          
          // Acción de login
          else {
            const user = await Usuario.findOne({ 
              email: credentials.email.toLowerCase() 
            })

            if (!user || !user.password) {
              throw new Error('Credenciales inválidas')
            }

            const isValid = await bcrypt.compare(credentials.password, user.password)

            if (!isValid) {
              throw new Error('Credenciales inválidas')
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.nombre,
              image: user.avatar || null
            }
          }
        } catch (error: any) {
          console.error('Error en autenticación:', error)
          throw new Error(error.message || 'Error en autenticación')
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 días
    updateAge: 24 * 60 * 60, // 24 horas
  },

  useSecureCookies: process.env.NODE_ENV === 'production',
  
  callbacks: {
    async signIn({ user, account, profile, isNewUser }: { user: any; account: any; profile?: any; isNewUser?: boolean }) {
      console.log('🔐 [AUTH CALLBACK] signIn iniciado:', {
        email: user.email,
        provider: account?.provider,
        isNewUser
      })
      
      // Para email magic link, también necesitamos el ID
      if (account?.provider === 'email') {
        try {
          await connectDB()
          const existingUser = await Usuario.findOne({ email: user.email?.toLowerCase() })
          if (existingUser) {
            user.id = existingUser._id.toString()
          }
        } catch (error) {
          console.error('❌ [AUTH CALLBACK] Error obteniendo usuario para email:', error)
        }
      }
      
      // Para Google OAuth, crear/actualizar usuario en BD
      if (account?.provider === 'google') {
        try {
          await connectDB()
          
          // Buscar si el usuario ya existe
          let existingUser = await Usuario.findOne({ email: user.email?.toLowerCase() })
          
          if (!existingUser) {
            // Crear nuevo usuario con datos completos de Google
            console.log('🆕 [AUTH CALLBACK] Creando nuevo usuario con Google:', user.email)
            existingUser = await Usuario.create({
              email: user.email?.toLowerCase(),
              nombre: user.name || user.email?.split('@')[0],
              avatar: user.image,
              experiencia: 'principiante',
              espacio: 'balcon',
              ubicacion: 'sol',
              objetivos: ['hobby'],
              tiempo: 'poco',
              perfil: {
                nombreCompleto: user.name,
                imagenGoogle: user.image,
                verificado: true,
                fechaRegistro: new Date(),
                completadoAutomaticamente: true
              }
            })
            console.log('✅ [AUTH CALLBACK] Usuario creado con ID:', existingUser._id)
          } else {
            console.log('👤 [AUTH CALLBACK] Usuario existente encontrado:', existingUser._id)
            // Actualizar avatar si cambió y marcar como datos actualizados
            if (user.image && existingUser.avatar !== user.image) {
              existingUser.avatar = user.image
              // Actualizar perfil con datos de Google
              if (!existingUser.perfil) {
                existingUser.perfil = {}
              }
              existingUser.perfil.imagenGoogle = user.image
              existingUser.perfil.ultimaActualizacion = new Date()
              await existingUser.save()
              console.log('🔄 [AUTH CALLBACK] Avatar actualizado para usuario:', existingUser._id)
            }
          }
          
          // Asignar el ID de MongoDB al user object
          user.id = existingUser._id.toString()

          console.log('✅ [AUTH CALLBACK] SignIn callback completado')
          return true
        } catch (error) {
          console.error('❌ [AUTH CALLBACK] Error en signIn callback:', error)
          return true // Permitir login pero loggear el error
        }
      }
      
      return true
    },
    
    async jwt({ token, user, account }) {
      // En el primer login, user está disponible
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      
      // Si no tenemos ID en el token pero tenemos email, buscar en BD
      if (!token.id && token.email) {
        try {
          await connectDB()
          const dbUser = await Usuario.findOne({ email: token.email.toLowerCase() })
          if (dbUser) {
            token.id = dbUser._id.toString()
          }
        } catch (error) {
          console.error('❌ Error obteniendo ID de usuario:', error)
        }
      }
      
      return token
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      try {
        // Si por algún motivo se intenta redirigir a /parcelas después del login,
        // forzar a /perfil (requerimiento del flujo).
        if (url.startsWith(baseUrl)) {
          const path = url.slice(baseUrl.length)
          if (path === '/parcelas' || path.startsWith('/parcelas/')) {
            return `${baseUrl}/perfil`
          }
          return url
        }
        // Evitar open-redirects
        return baseUrl
      } catch {
        return baseUrl
      }
    }
  },
  
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
    signOut: '/',
    // Redirigir al perfil después del login (cualquier método)
    newUser: '/perfil?welcome=true',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  events: {
    async signIn({ user, account, profile, isNewUser }: { user: any; account: any; profile?: any; isNewUser?: boolean }) {
      console.log('✅ Usuario ha iniciado sesión:', user.email)
      if (isNewUser) {
        console.log('🆕 Nuevo usuario detectado')
      }
    }
  }
}
