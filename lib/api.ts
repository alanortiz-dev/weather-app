const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Busca coordenadas geográficas de una ciudad usando la API de OpenWeather
export async function getCityCoordinates (query: string) {
  if (!query) return [];
  
  if (!API_KEY) {
    throw new Error('API key no configurada');
  }

  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}&lang=es`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.message}`);
    }
    
    const data = await response.json();
    return data.map((city: any) => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    }));
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    throw new Error('Error al buscar ciudades');
  }
}
// Obtiene el clima actual y pronóstico de una ciudad por coordenadas
export async function getWeatherData(lat: number, lon: number) {
  if (!API_KEY) {
    throw new Error('API key no configurada');
  }

  try {
    // Clima actual
    const currentResponse = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    );

    if (!currentResponse.ok) {
      const errorData = await currentResponse.json();
      throw new Error(`Error: ${errorData.message}`);
    }

    const currentData = await currentResponse.json();

    // Pronóstico extendido
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    );

    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      throw new Error(`Error: ${errorData.message}`);
    }

    const forecastData = await forecastResponse.json();

    // Procesar pronóstico para obtener un resumen diario (5 días)
    const dailySummary = forecastData.list
      .filter((item: any) => item.dt_txt.includes('12:00:00')) // una sola entrada por día
      .map((day: any) => ({
        date: new Date(day.dt * 1000).toLocaleDateString('es-ES', { weekday: 'short' }),
        temp: {
          min: Math.round(day.main.temp_min),
          max: Math.round(day.main.temp_max),
        },
        condition: day.weather[0].description,
        icon: day.weather[0].icon,
      }));

    return {
      city: currentData.name,
      current: {
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
      },
      daily: dailySummary,
    };
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw new Error('Error al obtener datos del clima');
  }
}
