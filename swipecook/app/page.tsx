'use client'

import Navbar from "@/components/Navbar"
import MealLike from "@/components/MealLike"

export default function page() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow flex items-center justify-center p-4">
        <MealLike />
      </main>
      <div className="p-4 bg-background">
        <Navbar />
      </div>
    </div>
  )
}