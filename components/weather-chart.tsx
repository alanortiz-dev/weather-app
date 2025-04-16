// weather-chart.tsx
// Genera la gráfica de temperaturas máximas y mínimas de los próximos días usando Recharts

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Definimos cómo luce cada día del pronóstico
interface Day {
  date: string;
  temp?: {
    min: number;
    max: number;
  };
}

// Recibimos los datos como prop
interface Props {
  data: Day[];
}

export function WeatherChart({ data }: Props) {
  // Aquí filtramos los datos por si alguna entrada no tiene temperaturas definidas
  const chartData = data
    .filter(
      (day) =>
        day.temp &&
        typeof day.temp.max === 'number' &&
        typeof day.temp.min === 'number'
    )
    .map((day) => ({
      name: day.date,         // Día en el eje X
      max: day.temp!.max,     // Temperatura máxima
      min: day.temp!.min,     // Temperatura mínima
    }));

   // Mostrar los datos por consola para debugging (Solo descomentar si es necesario)
  // console.log('Datos para la gráfica:', chartData);

  return (
    <div className="w-full h-64">
      {/* Gráfica responsiva con líneas para min/max temperaturas */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          {/* Fondo con líneas de ayuda */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* Eje X con los nombres de los días */}
          <XAxis dataKey="name" stroke="#8884d8" />

          {/* Eje Y con las temperaturas */}
          <YAxis stroke="#8884d8" />

          {/* Tooltip al pasar el mouse */}
          <Tooltip />

          {/* Línea para temperaturas máximas */}
          <Line
            type="monotone"
            dataKey="max"
            stroke="#f87171"
            name="Máxima"
          />

          {/* Línea para temperaturas mínimas */}
          <Line
            type="monotone"
            dataKey="min"
            stroke="#60a5fa"
            name="Mínima"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
