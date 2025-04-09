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
  onCitySelect: (city: City) => void;
}

export function SearchBar({ onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const results = await getCityCoordinates(query);
          setCities(results);
        } catch (error) {
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
        setCities([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, toast]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar ciudad..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {cities.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10">
              {cities.map((city) => (
                <Button
                  key={`${city.lat}-${city.lon}`}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onCitySelect(city);
                    setQuery('');
                    setCities([]);
                  }}
                >
                  {city.name}, {city.country}
                </Button>
              ))}
            </div>
          )}
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}