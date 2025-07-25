// app/LoadingContext.tsx
'use client'

import { createContext, ReactNode, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface LoadingContextValue {
    startLoading: () => void
}

export const LoadingContext = createContext<LoadingContextValue>({
    startLoading: () => { },
})

export function LoadingProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (loading) setLoading(false)
    }, [pathname, loading])

    const startLoading = () => setLoading(true)

    return (
        <LoadingContext.Provider value={{ startLoading }}>
            {loading && (
                <div
                    className="
            fixed inset-0 flex items-center justify-center
            bg-white/50 backdrop-blur-sm z-50
          "
                >
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                </div>
            )}
            {children}
        </LoadingContext.Provider>
    )
}
