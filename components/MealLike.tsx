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
  const [isHovered, setIsHovered] = useState(false)

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

  const handleSwipe = async (liked: boolean) => {
    if (meals.length > 0) {
      const currentMeal = meals[currentIndex];
  
      if (liked) {
        console.log("A aimé", currentMeal.name);
  
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Vérifiez si la recette est déjà likée
          const { data: existingLike, error: checkError } = await supabase
            .from('liked_recipes')
            .select('*')
            .eq('user_id', user.id)
            .eq('recipe_id', currentMeal.id)
            .single();
  
          if (checkError && checkError.code !== 'PGRST116') {
            console.error('Erreur lors de la vérification des likes:', checkError);
            return;
          }
  
          if (existingLike) {
            console.log('Cette recette est déjà dans les likes.');
          } else {
            // Ajout de la recette si elle n'est pas déjà likée
            const { error: insertError } = await supabase
              .from('liked_recipes')
              .insert({
                user_id: user.id,
                recipe_id: currentMeal.id,
              });
  
            if (insertError) {
              console.error("Erreur lors de l'ajout aux likes:", insertError);
            } else {
              console.log("Recette ajoutée aux likes.");
            }
          }
        }
      } else {
        console.log("N'a pas aimé", currentMeal.name);
      }
  
      // Passez au prochain plat
      setCurrentIndex((prevIndex) => (prevIndex + 1) % meals.length);
    }
  };
  

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
            <p className="text-sm leading-relaxed">{currentMeal.recette.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}