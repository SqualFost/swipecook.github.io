'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "./ui/button"
import { LogIn, LogOut } from "lucide-react"
import supabase from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthContext'

export default function Header() {
    const { isLoggedIn, login, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                login()
            } else {
                logout()
            }
        }

        checkUser()

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                login()
            } else {
                logout()
            }
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [login, logout])

    const handleAuthAction = async () => {
        if (isLoggedIn) {
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error('Error signing out:', error)
            } else {
                logout()
                router.push('/')
            }
        } else {
            router.push('/login')
        }
    }

    return (
        <header className="flex items-center justify-between pt-4 ps-4 pe-4">
            <h1 className="text-2xl font-bold">Swipe&Cook</h1>
            <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleAuthAction}
            >
                {isLoggedIn ? (
                    <>
                        <LogOut className="h-5 w-5" />
                        <span>Se déconnecter</span>
                    </>
                ) : (
                    <>
                        <LogIn className="h-5 w-5" />
                        <span>Se connecter</span>
                    </>
                )}
            </Button>
        </header>
    )
}