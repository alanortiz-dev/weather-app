export interface WeatherData {
  city: string;
  current: {
    temp: number;
    condition: string;
    icon: string;
  };
  daily: Array<{
    date: string;
    temp: {
      min: number;
      max: number;
    };
    condition: string;
    icon: string;
  }>;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}