import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Heart } from "lucide-react"
import supabase from '@/lib/supabaseClient'

type Recipe = {
  description: string;
  ingredients: string[];
}

type Meal = {
  id: number;
  name: string;
  nationalite: string; // Changement de "origin" à "nationalite"
  recette: Recipe;
  image: string;
  preferenceScore: number; // Score de préférence
  meat: boolean; // Indique si le plat contient de la viande
}

export default function MealLike() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likeCount, setLikeCount] = useState(0) // Compteur de likes
  const [preferences, setPreferences] = useState({
    nationalite: new Set<string>(), // Mise à jour de "origin" à "nationalite"
    meat: null as boolean | null
  })
  const [isInitialDiscovery, setIsInitialDiscovery] = useState(true) // Phase de découverte initiale

  useEffect(() => {
    const fetchMeals = async () => {
      const { data, error } = await supabase
        .from('meals')
        .select('id, name, recette, nationalite, image, meat') // Mise à jour du champ "origin" à "nationalite"

      if (error) {
        console.error("Error fetching meals:", error)
      } else if (data) {
        const mealsWithScores = data.map(meal => ({ ...meal, preferenceScore: 0 }))
        setMeals(mealsWithScores)
      }
    }

    fetchMeals()
  }, [])

  const handleSwipe = async (liked: boolean) => {
    if (meals.length > 0) {
      const updatedMeals = [...meals]
      const currentMeal = updatedMeals[currentIndex]

      if (liked) {
        // Mettre à jour les préférences en fonction du plat liké
        if (currentMeal.nationalite) { // Mise à jour de "origin" à "nationalite"
          preferences.nationalite.add(currentMeal.nationalite)
        }
        if (currentMeal.meat !== null) {
          preferences.meat = currentMeal.meat
        }

        setPreferences({ ...preferences }) // Actualiser les préférences
        setLikeCount(prevCount => prevCount + 1)

        // Augmenter les scores des plats correspondant aux nouvelles préférences
        updatedMeals.forEach(meal => {
          if (preferences.nationalite.has(meal.nationalite)) meal.preferenceScore += 1 // Mise à jour de "origin" à "nationalite"
          if (preferences.meat === meal.meat) meal.preferenceScore += 1
        })
      } else {
        currentMeal.preferenceScore -= 1
      }

      // Logique pour basculer entre phase de découverte et recommandations basées sur les préférences
      let nextIndex: number
      if (isInitialDiscovery) {
        // En phase de découverte, proposer des plats aléatoires
        nextIndex = Math.floor(Math.random() * meals.length)
        // Terminer la découverte après 10 interactions
        if (likeCount >= 9) {
          setIsInitialDiscovery(false) // Basculer vers la phase de recommandations basées sur les préférences
          setLikeCount(0) // Réinitialiser le compteur de likes
        }
      } else {
        // Mode de recommandation basé sur les préférences avec affichage aléatoire tous les 4 likes
        if (likeCount + 1 === 4) {
          setLikeCount(0) // Réinitialiser le compteur
          nextIndex = Math.floor(Math.random() * meals.length)
        } else {
          // Tri des plats en fonction du score de préférence
          const sortedMeals = updatedMeals.sort((a, b) => b.preferenceScore - a.preferenceScore)
          setMeals(sortedMeals)
          nextIndex = (currentIndex + 1) % meals.length
        }
      }

      setCurrentIndex(nextIndex)

      // Mise à jour de la base de données pour les scores modifiés
      const updates = updatedMeals
        .filter(meal => meal.preferenceScore !== meals.find(m => m.id === meal.id)?.preferenceScore)
        .map(async meal => {
          const { error } = await supabase
            .from('meals')
            .update({ preferenceScore: meal.preferenceScore })
            .eq('id', meal.id)

          if (error) {
            console.error(`Erreur lors de la mise à jour du score de préférence pour ${meal.name}:`, error)
          }
        })

      await Promise.all(updates)
    }
  }

  if (meals.length === 0) {
    return <div>Loading...</div> 
  }

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-0">
        <img 
          src={meals[currentIndex].image}
          alt={meals[currentIndex].name} 
          className="w-full h-[400px] object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2">{meals[currentIndex].name}</h2>
          <p className="text-sm text-gray-600 mb-4">{meals[currentIndex].recette.description}</p>
          <p className="text-xs text-gray-500 mb-4">{meals[currentIndex].nationalite}</p> {/* Mise à jour de "origin" à "nationalite" */}
          <p className="text-sm text-blue-600 font-semibold mb-4">Score de préférence : {meals[currentIndex].preferenceScore}</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-16 h-16"
              onClick={() => handleSwipe(false)}
            >
              <X className="h-8 w-8" />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600"
              onClick={() => handleSwipe(true)}
            >
              <Heart className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
