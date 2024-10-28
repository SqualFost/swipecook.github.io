import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Heart } from "lucide-react"

export default function MealLike() {
  const meals = [
    { name: "Spaghetti Carbonara", image: "/placeholder.svg?height=400&width=300" },
    { name: "Pad Thai", image: "/pad_thai.svg?height=400&width=300" },
    { name: "Sushi", image: "/sushi.svg?height=400&width=300" },
    { name: "Tacos", image: "/tacos.svg?height=400&width=300" }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSwipe = (liked: boolean) => {
    console.log(liked ? "Like" : "Dislike", meals[currentIndex].name)

    setCurrentIndex((prevIndex) => (prevIndex + 1) % meals.length)
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
