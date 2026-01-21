import '@testing-library/jest-dom'

// Mock de Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        }
    },
    useSearchParams() {
        return new URLSearchParams({
            page: '1',
            limit: '10',
        })
    },
    usePathname() {
        return '/parcelas'
    },
}))

// Mock de NextAuth
jest.mock('next-auth/react', () => ({
    useSession() {
        return {
            data: {
                user: {
                    id: 'test-user-id',
                    email: 'test@example.com',
                    name: 'Test User',
                },
            },
            status: 'authenticated',
        }
    },
    signIn: jest.fn(),
    signOut: jest.fn(),
}))

// Mock de Redis/Cache
jest.mock('@/lib/cache', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        invalidatePattern: jest.fn(),
        invalidateUser: jest.fn(),
        wrap: jest.fn(),
        getStats: jest.fn(),
        healthCheck: jest.fn(),
    },
}))

// Mock de Logger
jest.mock('@/lib/logger', () => ({
    __esModule: true,
    default: {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        http: jest.fn(),
        debug: jest.fn(),
        userAction: jest.fn(),
        performance: jest.fn(),
        business: jest.fn(),
        security: jest.fn(),
        cache: jest.fn(),
        database: jest.fn(),
        withTiming: jest.fn(),
    },
}))

// Mock de fetch global
global.fetch = jest.fn()

// Mock de localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

// Mock de ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// Mock de IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// Configuración de timeouts
jest.setTimeout(10000)
