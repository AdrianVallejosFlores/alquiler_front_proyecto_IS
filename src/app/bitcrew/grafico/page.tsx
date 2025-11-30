"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function GraficoIngresosPage() {
  const data = [
    { name: "Ingresos", value: 75.2, color: "#55a663" },
    { name: "Recargas", value: 65.1, color: "#6fa3ff" },
    { name: "Retiros", value: 25.0, color: "#e64b4b" },
  ];

  const totalIngresos = 75.2;
  const totalRecargas = 65.1;
  const totalRetiros = 25.0;

  return (
    <div className="w-full p-10">

      {/* Título principal */}
      <div className="text-center text-4xl font-bold mb-10">
        Gráfico de barras
      </div>

      {/* Subtítulo */}
      <div className="text-3xl font-bold mb-4">Fixer ingresos</div>

      <div className="flex gap-10">
        
        {/* === Gráfico === */}
        <div className="w-[70%] h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {data.map((entry, index) => (
                <Bar
                  key={index}
                  dataKey="value"
                  fill={entry.color}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* === Recuadro Totales === */}
        <div className="border-2 border-black rounded-xl p-4 w-[200px] h-[120px]">
          <p>Ingresos : {totalIngresos.toFixed(2)} bs</p>
          <p>Recargas : {totalRecargas.toFixed(2)} bs</p>
          <p>Retiros : {totalRetiros.toFixed(2)} bs</p>
        </div>
      </div>
    </div>
  );
}
