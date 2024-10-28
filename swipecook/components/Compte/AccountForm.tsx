import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AccountForm() {
  const [name, setName] = useState('Jolyan Lata')
  const [email, setEmail] = useState('zeBot@bronze4.com')
  const [bio, setBio] = useState('ARRACHEZ VOUS')

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Profil</h2>
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
    </section>
  )
}
