'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, MinusCircle, Upload } from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import Image from 'next/image'

export default function PostRecipe() {
  const [image, setImage] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [nationality, setNationality] = useState('')
  const [ingredients, setIngredients] = useState([''])
  const [steps, setSteps] = useState([''])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addItem = (list: string[], setList: (value: string[]) => void) => {
    setList([...list, ''])
  }

  const removeItem = (index: number, list: string[], setList: (value: string[]) => void) => {
    const newList = list.filter((_, i) => i !== index)
    setList(newList)
  }

  const updateItem = (index: number, value: string, list: string[], setList: (value: string[]) => void) => {
    const newList = [...list]
    newList[index] = value
    setList(newList)
  }

  const dataURLtoBlob = (dataURL: string) => {
    const parts = dataURL.split(';base64,')
    const byteString = atob(parts[1])
    const mimeString = parts[0].split(':')[1]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!name || !nationality || ingredients.length === 0 || steps.length === 0 || !image) {
      alert("Veuillez remplir tous les champs et ajouter une image.");
      return;
    }
  
    try {
      const fileName = `${Date.now()}-${name}.jpeg`;
      const { data: imageUpload, error: uploadError } = await supabase.storage
        .from('recipe-img')
        .upload(fileName, dataURLtoBlob(image));
  
      if (uploadError) {
        console.error("Erreur d'upload de l'image :", uploadError.message);
        alert("Une erreur est survenue lors du téléchargement de l'image.");
        return;
      }
  
      const imageUrl = supabase.storage.from('recipe-img').getPublicUrl(fileName).data.publicUrl;
  
      // Transformation des données avant l'insertion
      const formattedRecipe = {
        description: steps.join(" "), // Convertir le tableau `steps` en une chaîne
        ingredients: ingredients.filter((ingredient) => ingredient.trim() !== ""), // Supprimer les ingrédients vides
      };
  
      const { error } = await supabase
        .from('meals-pending')
        .insert([
          {
            name,
            nationalite: nationality,
            recette: JSON.stringify(formattedRecipe, null, 2), // Beautifier avec une indentation de 2 espaces // Formater correctement en JSON
            image: imageUrl,
          },
        ]);
      console.log(
        "Recette formatée :",
        JSON.stringify(formattedRecipe, null, 2) // Beautifier avec une indentation de 2 espaces
      );
  
      if (error) {
        console.error("Erreur lors de l'insertion de la recette :", error.message);
        alert("Une erreur est survenue lors de l'enregistrement de la recette.");
      } else {
        alert("Recette ajoutée avec succès !");
        setName('');
        setNationality('');
        setIngredients(['']);
        setSteps(['']);
        setImage(null);
      }
    } catch (error) {
      console.error("Erreur inconnue :", error);
      alert("Une erreur inconnue est survenue.");
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Publier une Recette</h1>
        <form onSubmit={handleSubmit} className="space-y-6 mb-20">
          <Card className="w-full max-w-md mx-auto cursor-pointer" onClick={handleImageClick}>
            <CardContent className="relative w-full h-64 rounded overflow-hidden">
              {image ? (
                <Image src={image} alt="Image de la recette" className="object-cover" fill />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto mt-20 h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Cliquez pour sélectionner une image</p>
                </div>
              )}
            </CardContent>
          </Card>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />

          <div className="space-y-2">
            <Label htmlFor="name">Nom de la recette</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Entrez le nom de la recette" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationalité</Label>
            <Input
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="Entrez la nationalité de la recette"
            />
          </div>

          <div className="space-y-2">
            <Label>Ingrédients</Label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="flex-shrink-0">• {index + 1}</span>
                <Textarea
                  value={ingredient}
                  onChange={(e) => updateItem(index, e.target.value, ingredients, setIngredients)}
                  placeholder={`Ingrédient ${index + 1}`}
                  className="flex-grow"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeItem(index, ingredients, setIngredients)}>
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem(ingredients, setIngredients)} className="mt-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un ingrédient
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Étapes de la recette</Label>
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="flex-shrink-0">• {index + 1}</span>
                <Textarea
                  value={step}
                  onChange={(e) => updateItem(index, e.target.value, steps, setSteps)}
                  placeholder={`Étape ${index + 1}`}
                  className="flex-grow"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeItem(index, steps, setSteps)}>
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem(steps, setSteps)} className="mt-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une étape
            </Button>
          </div>

          <Button type="submit" className="w-full mb-20">
            Publier la recette
          </Button>
        </form>
      </main>
    </div>
  )
}
