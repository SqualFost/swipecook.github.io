import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from 'react'

export default function DietaryPreferences() {
  const [dietaryPreference, setDietaryPreference] = useState('omnivore')

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Préférences alimentaires</h2>
      <div className="space-y-2">
        <Label htmlFor="dietary-preference">Régime alimentaire</Label>
        <Select value={dietaryPreference} onValueChange={setDietaryPreference}>
          <SelectTrigger id="dietary-preference">
            <SelectValue placeholder="Sélectionnez votre régime" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="omnivore">Omnivore</SelectItem>
            <SelectItem value="vegetarian">Végétarien</SelectItem>
            <SelectItem value="vegan">Végétalien</SelectItem>
            <SelectItem value="pescatarian">Pescétarien</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
