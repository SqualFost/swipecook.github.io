'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Heart } from 'lucide-react';
import supabase from '@/lib/supabaseClient';
import Image from 'next/image';

type Recipe = {
  description: string;
  ingredients: string[];
};

type Meal = {
  id: number;
  name: string;
  nationalite: string;
  meat: boolean;
  recette: Recipe;
  image: string;
};

type Preferences = {
  nationalite: { [key: string]: number };
  meat: number;
};

export default function MealLike() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMeals, setLikedMeals] = useState<number[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({
    nationalite: {},
    meat: 0,
  });
  const [likeCooldown, setLikeCooldown] = useState(false);
  const [randomCounter, setRandomCounter] = useState(0);

  useEffect(() => {
    const fetchMealsAndLikes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch likes avec les relations nécessaires
      const { data: likes, error: likesError } = await supabase
        .from('liked_recipes')
        .select(`
          recipe_id,
          meal (
            nationalite,
            meat
          )
        `)
        .eq('user_id', user.id);

      if (likesError) {
        console.error("Error fetching likes:", likesError);
        return;
      }

      // Initialisation des préférences
      const updatedPreferences = { nationalite: {}, meat: 0 };
      const likedMealIds = likes.map(like => like.recipe_id);

      // Calcul des préférences à partir des likes
      likes.forEach(like => {
        const meal = like.meal;
        if (meal) {
          const { nationalite, meat } = meal;
          updatedPreferences.nationalite[nationalite] =
            (updatedPreferences.nationalite[nationalite] || 0) + 1;
          updatedPreferences.meat += meat ? 1 : 0;
        } else {
          console.warn("Missing meal data for like:", like);
        }
      });

      setLikedMeals(likedMealIds);
      setPreferences(updatedPreferences);

      // Récupération des plats (exclusion des plats déjà likés)
      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('*')
        .not('id', 'in', `(${likedMealIds.join(',')})`);

      if (mealsError) {
        console.error("Error fetching meals:", mealsError);
      } else {
        // Trier les plats par score
        const sortedMeals = meals.sort((a, b) => calculateScore(b) - calculateScore(a));
        setMeals(sortedMeals);
      }
    };

    fetchMealsAndLikes();
  }, []);

  const calculateScore = (meal: Meal) => {
    const score =
      (preferences.nationalite[meal.nationalite] || 0) +
      (meal.meat ? preferences.meat : 0);
    return score;
  };

  const handleSwipe = async (liked: boolean) => {
    if (likeCooldown) return;

    setLikeCooldown(true);
    setTimeout(() => setLikeCooldown(false), 500); // Limite de 0,5s

    if (meals.length > 0) {
      const currentMeal = meals[currentIndex];

      // Mise à jour des préférences
      if (liked) {
        console.log("A aimé", currentMeal.name);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error: insertError } = await supabase
            .from('liked_recipes')
            .insert({
              user_id: user.id,
              recipe_id: currentMeal.id,
            });

          if (!insertError) {
            const updatedPreferences = { ...preferences };
            updatedPreferences.nationalite[currentMeal.nationalite] =
              (updatedPreferences.nationalite[currentMeal.nationalite] || 0) + 1;
            updatedPreferences.meat += currentMeal.meat ? 1 : 0;
            setPreferences(updatedPreferences);
          }
        }
      } else {
        console.log("N'a pas aimé", currentMeal.name);

        const updatedPreferences = { ...preferences };
        updatedPreferences.nationalite[currentMeal.nationalite] =
          (updatedPreferences.nationalite[currentMeal.nationalite] || 0) - 1;
        updatedPreferences.meat -= currentMeal.meat ? 1 : 0;
        setPreferences(updatedPreferences);
      }

      // Gérer le compteur aléatoire et sélectionner le prochain plat
      const nextIndex =
        (randomCounter + 1) % 5 === 0
          ? Math.floor(Math.random() * meals.length)
          : (currentIndex + 1) % meals.length;

      setRandomCounter((prev) => prev + 1);
      setCurrentIndex(nextIndex);
    }
  };

  if (meals.length === 0) {
    return <div>Loading...</div>;
  }

  const currentMeal = meals[currentIndex];

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
      <div className="relative flex">
        <Card className="w-[500px]">
          <CardContent className="p-0">
            <div className="relative pt-[75%]">
              <Image
                src={currentMeal.image}
                alt={currentMeal.name}
                width={500}
                height={500}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{currentMeal.name}</h2>
              <p className="text-sm text-gray-600 mb-3">{currentMeal.recette.description}</p>
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
      </div>
    </div>
  );
}
