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
  id: number
  name: string
  nationalite: string
  recette: Recipe
  image: string
}

export default function MealLike() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchMeals = async () => {
      const { data, error } = await supabase
        .from('meals')
        .select('id, name, recette, nationalite, image')

      if (error) {
        console.error("Error fetching meals:", error)
      } else {
        setMeals(data)
      }
    }

    fetchMeals()
  }, [])

  const handleSwipe = (liked: boolean) => {
    if (meals.length > 0) {
      console.log(liked ? "A aimé" : "N'a pas aimé", meals[currentIndex].name)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % meals.length)
    }
  }

  if (meals.length === 0) {
    return <div>Loading...</div> 
  }
  console.log(meals[currentIndex].image)

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
          <p className="text-xs text-gray-500 mb-4">{meals[currentIndex].nationalite}</p>
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
