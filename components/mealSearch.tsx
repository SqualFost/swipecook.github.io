'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import supabase from '@/lib/supabaseClient'

type Meal = {
  id: number
  name: string
  nationalite: string
  image: string // Nouveau champ pour l'image
}

export default function MealSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [recommendations, setRecommendations] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('meals')
        .select('id, name, nationalite, image') // Récupération du champ image
  
      if (error) {
        console.error("Erreur lors de la récupération des repas :", error)
      } else {
        setRecommendations(data as Meal[])
      }
      setLoading(false)
    }
  
    fetchMeals()
  }, [])
  

  // Filtrer les plats en fonction de la recherche
  const filteredMeals = recommendations.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.nationalite.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Recherche de Repas</h1>
        <Button variant="ghost" size="icon">
          <Search className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        {loading ? (
          <p className="text-center">Chargement des plats...</p>
        ) : (
          <div className="space-y-4">
            <Input
              type="search"
              placeholder="Rechercher un repas ou une cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />

            <div className="space-y-2 pb-20">
              {filteredMeals.map((meal) => (
                <Card key={meal.id}>
                  <CardContent className="flex items-center space-x-4 p-4">
                    {/* Image du repas */}
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    {/* Infos texte */}
                    <div>
                      <h2 className="text-lg font-semibold">{meal.name}</h2>
                      <p className="text-sm text-muted-foreground">{meal.nationalite}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredMeals.length === 0 && (
                <p className="text-center text-muted-foreground">Aucun repas trouvé</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
