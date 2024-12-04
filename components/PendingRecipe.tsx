'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Check, X } from 'lucide-react'
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

export default function AdminPendingMeals() {
  const [pendingMeals, setPendingMeals] = useState<Meal[]>([])
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)

  useEffect(() => {
    fetchPendingMeals()
  }, [])

  const fetchPendingMeals = async () => {
    const { data, error } = await supabase
      .from('meals-pending')
      .select('*')
    
    if (error) {
      console.error("Error fetching pending Meals:", error)
    } else {
      setPendingMeals(data)
    }
  }

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal)
  }

  const handleSave = async () => {
    if (editingMeal) {
      const { error } = await supabase
        .from('meals-pending')
        .update(editingMeal)
        .eq('id', editingMeal.id)
      
      if (error) {
        console.error("Error updating recipe:", error)
      } else {
        setEditingMeal(null)
        fetchPendingMeals()
      }
    }
  }

  const handleApprove = async (meal: Meal) => {
    const { error: deleteError } = await supabase
      .from('meals-pending')
      .delete()
      .eq('id', meal.id)
    
    if (deleteError) {
      console.error("Error deleting from pending Meals:", deleteError)
      return
    }

    const { error: insertError } = await supabase
      .from('meals')
      .insert(meal)
    
    if (insertError) {
      console.error("Error inserting into meals:", insertError)
    } else {
      fetchPendingMeals()
    }
  }

  const handleReject = async (recipeId: number) => {
    const { error } = await supabase
      .from('meals-pending')
      .delete()
      .eq('id', recipeId)
    
    if (error) {
      console.error("Error rejecting recipe:", error)
    } else {
      fetchPendingMeals()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Recettes en attente de validation</h1>
        {pendingMeals.length == 0 ? 
        <p>Pas de recette en attente de validation </p>: <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingMeals.map(meal => (
            <Card key={meal.id}>
              <CardHeader>
                <CardTitle>{meal.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={meal.image}
                  alt={meal.name}
                  width={500}
                  height={48}
                  className='w-full h-48 object-cover rounded-md mb-2'
                />
                {editingMeal?.id === meal.id ? (
                  <div className="space-y-2">
                    <Label htmlFor={`name-${meal.id}`}>Nom</Label>
                    <Input
                      id={`name-${meal.id}`}
                      value={editingMeal.name}
                      onChange={(e) => setEditingMeal({...editingMeal, name: e.target.value})}
                    />
                    <Label htmlFor={`nationality-${meal.id}`}>Nationalité</Label>
                    <Input
                      id={`nationality-${meal.id}`}
                      value={editingMeal.nationalite}
                      onChange={(e) => setEditingMeal({...editingMeal, nationalite: e.target.value})}
                    />
                    <Label htmlFor={`ingredients-${meal.id}`}>Ingrédients</Label>
                    <Textarea
                      id={`ingredients-${meal.id}`}
                      value={editingMeal.recette.ingredients.join('\n')}
                      onChange={(e) => setEditingMeal({...editingMeal, recette: {...editingMeal.recette, ingredients: e.target.value.split('\n')}})}
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-2">Nationalité: {meal.nationalite}</p>
                    <p className="text-sm font-semibold mb-1">Ingrédients:</p>
                    <ul className="list-disc pl-5 mb-2">
                      {meal.recette.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-sm">{ingredient}</li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {editingMeal?.id === meal.id ? (
                  <Button onClick={handleSave}>Sauvegarder</Button>
                ) : (
                  <Button onClick={() => handleEdit(meal)}>Modifier</Button>
                )}
                <div className="space-x-2">
                  <Button onClick={() => handleApprove(meal)} variant="default" size="icon">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleReject(meal.id)} variant="destructive" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>}
      </main>
    </div>
  )
}