'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Heart } from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import Image from 'next/image'

type Recipe = {
  description: string;
  ingredients: string[];
  etapes: string[];
}

type Meal = {
  id: number
  name: string
  nationalite: string
  recette: Recipe
  image: string
  meat: boolean | null
}

type Preferences = {
  nationalite: Record<string, number>;
  meat: Record<string, number>;
}

export default function MealLike() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [preferences, setPreferences] = useState<Preferences>({
    nationalite: {},
    meat: { true: 0, false: 0 },
  })
  const [isHovered, setIsHovered] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Charger l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) console.error("Erreur lors de la récupération de l'utilisateur:", error)
      setUserId(data.user?.id || null)
    }
    fetchUser()
  }, [])

  // Charger les plats et filtrer ceux déjà likés
  useEffect(() => {
    const fetchMeals = async () => {
      if (!userId) return

      const { data: mealsData, error: mealsError } = await supabase
        .from("meals")
        .select("id, name, nationalite, recette, image, meat")
      if (mealsError) {
        console.error("Erreur lors de la récupération des plats:", mealsError)
        return
      }

      const { data: likedData, error: likedError } = await supabase
        .from("liked_recipes")
        .select("recipe_id")
        .eq("user_id", userId)
      if (likedError) {
        console.error("Erreur lors de la récupération des likes:", likedError)
        return
      }

      const likedMealIds = new Set(likedData?.map((like) => like.recipe_id) || [])
      setMeals(mealsData?.filter((meal) => !likedMealIds.has(meal.id)) || [])
    }
    fetchMeals()
  }, [userId])

  // Algorithme de sélection basé sur les préférences
  const getNextMealIndex = () => {
    if (meals.length === 0) return 0

    const scoredMeals = meals.map((meal, index) => {
      let score = 0
      if (preferences.nationalite[meal.nationalite]) {
        score += preferences.nationalite[meal.nationalite]
      }
      const meatKey = meal.meat?.toString() || "false"
      if (preferences.meat[meatKey]) {
        score += preferences.meat[meatKey]
      }
      return { index, score }
    })

    scoredMeals.sort((a, b) => b.score - a.score)
    return scoredMeals[0].index
  }

  // Gestion du swipe
  const handleSwipe = async (liked: boolean) => {
    if (meals.length === 0) return

    const currentMeal = meals[currentIndex]
    const updatedPreferences = { ...preferences }

    if (liked) {
      updatedPreferences.nationalite[currentMeal.nationalite] =
        (updatedPreferences.nationalite[currentMeal.nationalite] || 0) + 1

      const meatKey = currentMeal.meat?.toString() || "false"
      updatedPreferences.meat[meatKey] =
        (updatedPreferences.meat[meatKey] || 0) + 1

      await supabase.from("liked_recipes").insert({
        user_id: userId,
        recipe_id: currentMeal.id,
      })
    } else {
      updatedPreferences.nationalite[currentMeal.nationalite] =
        (updatedPreferences.nationalite[currentMeal.nationalite] || 0) - 1

      const meatKey = currentMeal.meat?.toString() || "false"
      updatedPreferences.meat[meatKey] =
        (updatedPreferences.meat[meatKey] || 0) - 1
    }

    setPreferences(updatedPreferences)
    const remainingMeals = meals.filter((_, index) => index !== currentIndex)
    setMeals(remainingMeals)
    setCurrentIndex(getNextMealIndex())
  }

  if (meals.length === 0) {
    return <div>Loading...</div>
  }

  const currentMeal = meals[currentIndex]

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
      <div 
        className="relative flex transition-all duration-300 ease-in-out"
        style={{ 
          width: isHovered ? '1000px' : '500px',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="w-[500px] transition-all duration-300 ease-in-out">
          <CardContent className="p-0">
            <div className="relative pt-[75%]">
              <Image
                src={currentMeal.image}
                alt={currentMeal.name}
                width={500}
                height={500}
                className='absolute inset-0 w-full h-full object-cover rounded-t-lg'
                />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{currentMeal.name}</h2>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{currentMeal.recette.description}</p>
              <p className="text-xs text-gray-500 mb-3">{currentMeal.nationalite}</p>
              <div className="flex justify-center gap-4 mt-4">
                <Button 
                  variant="default" 
                  size="icon" 
                  className="rounded-full w-14 h-14 bg-red-500 hover:bg-red-600"
                  onClick={() => handleSwipe(false)}
                >
                  <X className="h-6 w-6 text-white" />
                </Button>
                <Button 
                  variant="default" 
                  size="icon" 
                  className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600"
                  onClick={() => handleSwipe(true)}
                >
                  <Heart className="h-6 w-6 text-white" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`w-[500px] overflow-hidden transition-all duration-300 ease-in-out ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full w-0'
          }`}
        >
          <CardContent className="p-6 h-full overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Ingrédients:</h3>
            <ul className="list-disc pl-5 mb-6 space-y-1">
              {currentMeal.recette.ingredients.map((ingredient, index) => (
                <li key={index} className="text-sm">{ingredient}</li>
              ))}
            </ul>
            <h3 className="text-lg font-bold mb-3">Étapes:</h3>
            <ul className='list-disc pl-5 mb-6 space-y-1'>
              {currentMeal.recette.etapes.map((etape, index) => (
                <li key={index} className='text-sm'>{etape}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}