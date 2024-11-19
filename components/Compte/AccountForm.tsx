import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import supabase from '@/lib/supabaseClient.js'

export default function AccountForm() {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        if (user) {
          setEmail(user.email || '')

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single()

          if (profileError) {
            throw profileError
          }

          setName(profileData.first_name +" " + profileData.last_name || '')
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <p>Chargement...</p>
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Profil</h2>
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          readOnly
        />
      </div>
    </section>
  )
}
