"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

interface IngresoData {
  name: string;
  value: number;
  color: string;
}

export default function GraficoIngresosPage() {
  //const [data, setData] = useState<any[]>([]);
  const [data, setData] = useState<IngresoData[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // 🚀 Simulación de API (reemplaza por fetch real)
  // ---------------------------------------
  useEffect(() => {
    setTimeout(() => {
      try {
        const apiData = [
          { name: "Ingresos", value: 75.2, color: "#55a663" },
          { name: "Recargas", value: 65.1, color: "#6fa3ff" },
          { name: "Retiros", value: 25.0, color: "#e64b4b" },
        ];

        setData(apiData);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }, 800); // Menor a 2 segundos (#322)
  }, []);

  // ---------------------------------------
  // 🟡 Estados especiales (#320 y #321)
  // ---------------------------------------
  if (loading) {
    return (
      <div className="text-center mt-10 text-xl font-semibold">
        Cargando tus ingresos…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 text-xl font-bold">
        Error al cargar tus ingresos. Intenta nuevamente.
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600 text-xl font-semibold">
        No tienes ingresos recientes para mostrar
      </div>
    );
  }

  // Totales
  const totalIngresos = data[0].value;
  const totalRecargas = data[1].value;
  const totalRetiros = data[2].value;

  // Auto escala dinámica Y (#314)
  const maxValue = Math.max(...data.map((d) => d.value));
  const yMax = Math.ceil(maxValue + maxValue * 0.2);

  return (
    <div className="p-6 w-full">
      {/* Sticky al hacer scroll (#324) */}
        <div className="w-full bg-gradient-to-r from-[#11255A] via-[#5A7ACD] to-[#8DC0FF] py-6 text-center">
        <h1 className="text-white text-4xl font-bold">
            Gráfico de barras
        </h1>
        </div>

      <h2 className="text-3xl font-bold mt-8 mb-6">Fixer ingresos</h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* ===== Gráfico ===== */}
        <div className="w-full md:w-[70%] h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid vertical={false} opacity={0.3} />

                <XAxis dataKey="name" tick={{ fontSize: 14, fontWeight: "bold" }} />
                <YAxis domain={[0, yMax]} tick={{ fontSize: 14 }} tickFormatter={(val) => `${val} bs`} />
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)} bs`, ""]} />

                {/* Barra única con colores según categoría usando Cell */}
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>

        {/* ===== Recuadro Totales (#318, #319) ===== */}
        <div className="border-2 border-black rounded-xl p-4 w-[230px] h-fit shadow-lg">
          <p className="font-semibold text-lg">
            Ingresos: {totalIngresos.toFixed(2)} bs
          </p>
          <p className="font-semibold text-lg">
            Recargas: {totalRecargas.toFixed(2)} bs
          </p>
          <p className="font-semibold text-lg">
            Retiros: {totalRetiros.toFixed(2)} bs
          </p>
        </div>
      </div>
    </div>
  );
}

