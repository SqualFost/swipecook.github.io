'use client';

import Header from '@/components/Compte/Header'
import AccountForm from '@/components/Compte/AccountForm'
import DietaryPreferences from '@/components/Compte/DietaryPreferences'
import AppPreferences from '@/components/Compte/AppPreferences'
import { Button } from "@/components/ui/button"

export default function AccountSettings() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Settings saved')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AccountForm />
          <DietaryPreferences />
          <AppPreferences />
          <Button type="submit" className="w-full">Sauvegarder les changements</Button>
        </form>
      </main>
    </div>
  )
}
