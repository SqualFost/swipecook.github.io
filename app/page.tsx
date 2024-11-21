'use client'

import Navbar from "@/components/Navbar"
import MealLike from "@/components/MealLike"
import Header from "@/components/Header"

export default function page() {
  return (
    <div className="flex flex-col h-screen">
      <Header/>
      <main className="flex-grow flex items-center justify-center p-4">
        <MealLike />
      </main>
      <Navbar />
    </div>
  )
}