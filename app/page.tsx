'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search-bar';
import { WeatherChart } from '@/components/weather-chart';
import { getWeatherData } from '@/lib/api';
import type { City, WeatherData } from '@/lib/types';
import { Cloud, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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

  return (
    <main className="min-h-screen bg-background text-foreground">
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
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">{weather.city}</h1>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
                  alt={weather.current.condition}
                  className="w-20 h-20"
                />
                <div>
                  <p className="text-4xl font-bold">{weather.current.temp}°C</p>
                  <p className="text-muted-foreground capitalize">
                    {weather.current.condition}
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