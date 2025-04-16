'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { getCityCoordinates } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import type { City } from '@/lib/types';

interface SearchBarProps {
  // Esta función se ejecuta cuando el usuario elige una ciudad
  onCitySelect: (city: City) => void;
}

export function SearchBar({ onCitySelect }: SearchBarProps) {
  // Estado para guardar el texto que escribe el usuario
  const [query, setQuery] = useState('');

  // Estado con las ciudades que devuelve la API
  const [cities, setCities] = useState<City[]>([]);

  // Esto indica si estamos esperando resultados (sirve para deshabilitar el input)
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast(); // Hook para mostrar errores

  useEffect(() => {
    // Esperamos 300ms antes de hacer la búsqueda (debounce)
    const searchTimeout = setTimeout(async () => {
      // Solo buscamos si hay más de 2 caracteres
      if (query.length > 2) {
        setIsLoading(true);
        try {
          // Buscamos en la API las coordenadas de la ciudad
          const results = await getCityCoordinates(query);
          setCities(results);
        } catch (error) {
          // Si algo sale mal, mostramos un mensaje
          console.error('Error buscando ciudades:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : 'Error al buscar ciudades'
          });
          setCities([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Si hay menos de 3 caracteres, limpiamos la lista
        setCities([]);
      }
    }, 300);

    // Limpiamos el timeout si el usuario sigue escribiendo
    return () => clearTimeout(searchTimeout);
  }, [query, toast]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {/* Input de búsqueda con ícono */}
          <Input
            type="text"
            placeholder="Buscar ciudad..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          {/* Lista de ciudades encontradas */}
          {cities.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10">
              {cities.map((city) => (
                <Button
                  key={`${city.lat}-${city.lon}`}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    // Cuando el usuario selecciona una ciudad
                    onCitySelect(city); // Llamamos al callback con la ciudad
                    setQuery('');        // Limpiamos el input
                    setCities([]);       // Y limpiamos los resultados
                  }}
                >
                  {city.name}, {city.country}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Botón para cambiar entre tema claro / oscuro */}
        <ThemeToggle />
      </div>
    </div>
  );
}