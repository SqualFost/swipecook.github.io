'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import supabase from '@/lib/supabaseClient'
import Link from 'next/link'
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

export default function LikedRecipes() {
  const [recipes, setRecipes] = useState<Meal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredRecipe, setHoveredRecipe] = useState<number | null>(null)
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (isLoggedIn) {
      fetchLikedRecipes()
    }
  }, [isLoggedIn])

  const fetchLikedRecipes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('liked_recipes')
        .select('meals(id, name, recette, nationalite, image)')
        .eq('user_id', user.id)
      
      if (error) {
        console.error('Error fetching liked recipes:', error)
        alert('Une erreur est survenue lors du chargement des recettes.')
      } else {  
        setRecipes(data.map((item: any) => item.meals))
      }
    }
  }

  const deleteRecipe = async (recipeId: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase
        .from('liked_recipes')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)

      if (error) {
        console.error('Error deleting recipe:', error)
        alert('Une erreur est survenue lors de la suppression de la recette.')
      } else {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId))
      }
    }
  }

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Mes Recettes Likées</h1>
        
        <div className="mb-4 relative">
          <Input
            type="search"
            placeholder="Rechercher une recette..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {isLoggedIn ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="overflow-hidden relative"
                onMouseEnter={() => setHoveredRecipe(recipe.id)}
                onMouseLeave={() => setHoveredRecipe(null)}
              >
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  className='w-full h-48 object-cover'
                  width={500}
                  height={48}  
                />
                {hoveredRecipe === recipe.id && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => deleteRecipe(recipe.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <CardHeader>
                  <CardTitle>{recipe.name}</CardTitle>
                  <CardDescription>{recipe.recette.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">Ingrédients :</h3>
                  <ul className="list-disc pl-5">
                    {recipe.recette.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm">{ingredient}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl font-semibold">Connectez-vous pour voir vos recettes likées</p>
            <Link href="/login" passHref>
              <Button size="lg" className="font-semibold">
                Se connecter pour voir les paramètres
              </Button>
            </Link>
          </div>
        )}

        {isLoggedIn && filteredRecipes.length === 0 && (
          <p className="text-center py-10">Aucune recette trouvée.</p>
        )}
      </main>
    </div>
  )
}
