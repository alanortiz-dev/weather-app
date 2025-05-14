'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search-bar';
import { WeatherChart } from '@/components/weather-chart';
import { getWeatherData } from '@/lib/api';
import type { City, WeatherData } from '@/lib/types';
import { Cloud, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Maneja todas las condiciones posibles sin romper si viene undefined
function getWeatherBackground(condition?: string): string {
  if (!condition) {
    return 'from-slate-200 via-slate-300 to-slate-400 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900';
  }

  const cond = condition.toLowerCase();

  if (cond.includes('clear')) return 'from-yellow-100 via-orange-300 to-pink-400 dark:from-yellow-300 dark:via-orange-500 dark:to-pink-600';
  if (cond.includes('cloud')) return 'from-gray-300 via-gray-400 to-gray-500 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800';
  if (cond.includes('rain') || cond.includes('drizzle')) return 'from-blue-300 via-blue-500 to-indigo-600 dark:from-blue-700 dark:via-indigo-800 dark:to-gray-900';
  if (cond.includes('thunder')) return 'from-purple-800 via-indigo-900 to-black';
  if (cond.includes('snow')) return 'from-blue-100 via-white to-gray-200 dark:from-gray-300 dark:via-gray-400 dark:to-gray-500';
  if (cond.includes('mist') || cond.includes('haze') || cond.includes('fog')) return 'from-gray-200 via-gray-300 to-gray-400 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800';
  if (cond.includes('smoke') || cond.includes('ash')) return 'from-zinc-300 via-neutral-400 to-stone-500 dark:from-zinc-700 dark:via-neutral-800 dark:to-stone-900';
  if (cond.includes('dust') || cond.includes('sand')) return 'from-yellow-200 via-yellow-300 to-amber-400 dark:from-yellow-600 dark:via-amber-700 dark:to-yellow-800';
  if (cond.includes('squall')) return 'from-cyan-400 via-blue-500 to-indigo-700 dark:from-cyan-700 dark:via-blue-800 dark:to-indigo-900';
  if (cond.includes('tornado')) return 'from-red-500 via-gray-700 to-black dark:from-red-800 dark:via-gray-900 dark:to-black';

  return 'from-slate-200 via-slate-300 to-slate-400 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900';
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCitySelect = async (city: City) => {
    setIsLoading(true);
    try {
      const data = await getWeatherData(city.lat, city.lon);
      data.city = `${city.name}, ${city.country}`;
      setWeather(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Error al obtener datos del clima'
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Condición del clima (main):", weather?.current?.main);
  console.log("Descripción (es):", weather?.current?.description);

  return (
    <main className={`min-h-screen bg-gradient-to-br text-foreground transition-all duration-500 ${
      getWeatherBackground(weather?.current?.main)
    }`}>
      <SearchBar onCitySelect={handleCitySelect} />

      <div className="max-w-2xl mx-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !weather ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <Cloud className="h-16 w-16 mb-4" />
            <p>Busca una ciudad para ver el clima</p>
          </div>
        ) : (
          <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 rounded-2xl p-6 shadow-lg border border-white/20 space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 text-primary drop-shadow-md">{weather.city}</h1>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
                  alt={weather.current.description}
                  className="w-20 h-20 animate-bounce"
                />
                <div>
                  <p className="text-4xl font-bold">{weather.current.temp}°C</p>
                  <p className="text-muted-foreground capitalize">
                    {weather.current.description}
                  </p>
                </div>
              </div>
            </div>
            <WeatherChart data={weather.daily} />
          </div>
        )}
      </div>
    </main>
  );
}
