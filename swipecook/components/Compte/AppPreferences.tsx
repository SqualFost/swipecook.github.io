import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from 'react'

export default function AppPreferences() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Paramètres de l'application</h2>
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Notifications</Label>
        <Switch
          id="notifications"
          checked={notifications}
          onCheckedChange={setNotifications}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Mode sombre</Label>
        <Switch
          id="dark-mode"
          checked={darkMode}
          onCheckedChange={setDarkMode}
        />
      </div>
    </section>
  )
}
