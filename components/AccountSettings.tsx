'use client';

import Link from 'next/link';
import AccountForm from '@/components/Compte/AccountForm'
import DietaryPreferences from '@/components/Compte/DietaryPreferences'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/components/AuthContext';

export default function AccountSettings() {
  const { isLoggedIn } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Settings saved')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-4 overflow-y-auto relative">
        {!isLoggedIn ? (
          <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center">
            <Link href="/login" passHref>
              <Button size="lg" className="font-semibold">
                Se connecter pour voir les paramètres
              </Button>
            </Link>
          </div>
        ) : null}
        <div className={!isLoggedIn ? 'pointer-events-none' : ''}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <AccountForm />
            <DietaryPreferences />
            <Button type="submit" className="w-full">Sauvegarder les changements</Button>
          </form>
        </div>
      </main>
    </div>
  )
}