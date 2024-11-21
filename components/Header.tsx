'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "./ui/button"
import { LogIn, LogOut, Bell} from "lucide-react"
import supabase from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthContext'
import Link from 'next/link'

export default function Header() {
    const { isLoggedIn, login, logout } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                login()

                const { data, error } = await supabase
                    .from('profiles')
                    .select('isAdmin')
                    .eq('id', user.id)
                    .single()

                if (error) {
                    console.error("Erreur lors de la récupération des données utilisateur:", error)
                    setIsAdmin(false)
                } else {
                    setIsAdmin(data?.isAdmin || false)
                }
            } else {
                logout()
            }
        }

        checkUser()

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                login()
                checkUser()
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
            <div className='flex gap-8'>
                {isLoggedIn && isAdmin && (
                    <Link href='/validation'>
                        <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                        >
                            <Bell className="h-5 w-5" />
                            <span>Notifications</span>
                        </Button>
                    </Link>
                )}
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
            </div>
        </header>
    )
}
