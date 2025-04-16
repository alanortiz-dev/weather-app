'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search-bar';
import { WeatherChart } from '@/components/weather-chart';
import { getWeatherData } from '@/lib/api';
import type { City, WeatherData } from '@/lib/types';
import { Cloud, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  // Aquí guardamos la info del clima cuando el usuario busca una ciudad
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Este estado es para mostrar el spinner mientras cargan los datos
  const [isLoading, setIsLoading] = useState(false);

  // Hook para mostrar notificaciones (toast) si algo sale mal
  const { toast } = useToast();

  // Esta función se dispara cuando el usuario elige una ciudad del buscador
  const handleCitySelect = async (city: City) => {
    setIsLoading(true); // Mostramos el spinner

    try {
      // Llamamos a la API con latitud y longitud
      const data = await getWeatherData(city.lat, city.lon);

      // Le agregamos el nombre de la ciudad para mostrarlo más fácil
      data.city = `${city.name}, ${city.country}`;

      // Guardamos los datos en el estado
      setWeather(data);
    } catch (error) {
      // Si algo falla, mostramos un toast con el mensaje de error
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Error al obtener datos del clima'
      });
      console.error(error);
    } finally {
      // Quitamos el spinner pase lo que pase
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Componente para buscar una ciudad */}
      <SearchBar onCitySelect={handleCitySelect} />
      
      <div className="max-w-2xl mx-auto p-4">
        {isLoading ? (
          // Si está cargando, mostramos el ícono girando
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !weather ? (
          // Si no hay datos aún, mostramos un mensaje amigable
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <Cloud className="h-16 w-16 mb-4" />
            <p>Busca una ciudad para ver el clima</p>
          </div>
        ) : (
          // Si ya tenemos datos, mostramos la info del clima
          <div className="space-y-8">
            <div className="text-center">
              {/* Nombre de la ciudad */}
              <h1 className="text-2xl font-bold mb-4">{weather.city}</h1>

              {/* Ícono del clima y temperatura */}
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
            
            {/* Componente con la gráfica de los próximos días */}
            <WeatherChart data={weather.daily} />
          </div>
        )}
      </div>
    </main>
  );
}
