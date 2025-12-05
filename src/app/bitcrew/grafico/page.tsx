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
import { useSearchParams } from "next/navigation";
import { useWallet } from "../wallet/hooks/useWallet";

interface IngresoData {
  name: string;
  value: number;
  color: string;
}

// Ventana de tiempo para el gráfico
const DAYS_WINDOW = 30; // últimos 30 días
// Mínimo visual para barras con valor > 0
const MIN_VISUAL_PERCENT = 5; // 5%

export default function GraficoIngresosPage() {
  const searchParams = useSearchParams();
  const fixerId = searchParams.get("fixer_id");

  const { balanceData, transactions, loading, error } = useWallet(fixerId);

  // =========================
  // Estados base
  // =========================
  if (!fixerId) {
    return (
      <div className="p-6 w-full">
        <div className="w-full bg-gradient-to-r from-[#11255A] via-[#5A7ACD] to-[#8DC0FF] py-6 text-center">
          <h1 className="text-white text-4xl font-bold">Gráfico de barras</h1>
        </div>
        <h2 className="text-3xl font-bold mt-8 mb-6">Fixer ingresos</h2>

        <div className="text-center mt-10 text-red-600 text-xl font-bold">
          No se detectó un ID de Fixer en la URL.
        </div>
      </div>
    );
  }

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

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-6 w-full">
        <div className="w-full bg-gradient-to-r from-[#11255A] via-[#5A7ACD] to-[#8DC0FF] py-6 text-center">
          <h1 className="text-white text-4xl font-bold">Gráfico de barras</h1>
        </div>
        <h2 className="text-3xl font-bold mt-8 mb-6">Fixer ingresos</h2>

        <div className="text-center mt-10 text-gray-600 text-xl font-semibold">
          No tienes ingresos recientes para mostrar
        </div>
      </div>
    );
  }

  // =========================
  // Filtrar por últimos N días
  // =========================
  const now = new Date();
  const fromDate = new Date();
  fromDate.setDate(now.getDate() - DAYS_WINDOW);

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date as any);
    if (Number.isNaN(txDate.getTime())) return false;
    return txDate >= fromDate && txDate <= now;
  });

  if (filteredTransactions.length === 0) {
    return (
      <div className="p-6 w-full">
        <div className="w-full bg-gradient-to-r from-[#11255A] via-[#5A7ACD] to-[#8DC0FF] py-6 text-center">
          <h1 className="text-white text-4xl font-bold">Gráfico de barras</h1>
        </div>
        <h2 className="text-3xl font-bold mt-8 mb-2">Fixer ingresos</h2>
        <p className="text-sm text-gray-500 mb-6">
          Periodo: últimos {DAYS_WINDOW} días
        </p>

        <div className="text-center mt-10 text-gray-600 text-xl font-semibold">
          No tienes ingresos recientes para mostrar en los últimos {DAYS_WINDOW} días
        </div>
      </div>
    );
  }

  // =========================
  // Cálculo de totales reales
  // =========================
  let ingresosTotal = 0;
  let recargasTotal = 0;
  let retirosTotal = 0;

  for (const tx of filteredTransactions) {
    const desc = (tx.descripcion ?? "").toLowerCase();
    const tipo = (tx.type ?? "").toLowerCase(); // "credito" | "debito"
    const monto = Number(tx.amount) || 0;

    if (desc.includes("recarga")) {
      recargasTotal += monto;
      continue;
    }

    if (tipo === "debito" || desc.includes("retiro")) {
      retirosTotal += Math.abs(monto);
      continue;
    }

    ingresosTotal += monto;
  }

  // Datos en valores reales (Bs)
  const rawData: IngresoData[] = [
    { name: "Ingresos", value: ingresosTotal, color: "#55a663" },
    { name: "Recargas", value: recargasTotal, color: "#6fa3ff" },
    { name: "Retiros", value: retirosTotal, color: "#e64b4b" },
  ];

  // =========================
  // Normalización para el gráfico (0–100 %) con mínimo visual
  // =========================
  const maxValue = Math.max(...rawData.map((d) => d.value)) || 1;

  const chartData = rawData.map((d) => {
    const realPercent = (d.value / maxValue) * 100; // % real
    const normalized =
      d.value > 0 && realPercent > 0 && realPercent < MIN_VISUAL_PERCENT
        ? MIN_VISUAL_PERCENT // mínimo visual
        : realPercent;

    return {
      ...d,
      normalized,
      realPercent,
    };
  });

  const saldoActual = balanceData?.saldo ?? 0;
  const moneda = balanceData?.moneda ?? "Bs";

  // =========================
  // Render
  // =========================
  return (
    <div className="p-6 w-full">
      <div className="w-full bg-gradient-to-r from-[#11255A] via-[#5A7ACD] to-[#8DC0FF] py-6 text-center">
        <h1 className="text-white text-4xl font-bold">Gráfico de barras</h1>
      </div>

      <div className="flex flex-col md:flex-row mt-8 mb-2 items-start justify-between gap-4">
        <h2 className="text-3xl font-bold">Fixer ingresos</h2>

        <div className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm bg-white">
          <p className="text-sm text-gray-500">Saldo actual</p>
          <p className="text-xl font-bold">
            {moneda} {saldoActual.toFixed(2)}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Periodo: últimos {DAYS_WINDOW} días (escala relativa, barras mínimas del{" "}
        {MIN_VISUAL_PERCENT}% para valores muy pequeños)
      </p>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Gráfico */}
        <div className="w-full md:w-[70%] h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} opacity={0.3} />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 14, fontWeight: "bold" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 14 }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                formatter={(_value: number, _name: string, item: any) => {
                  const original = item?.payload?.value ?? 0;
                  const realPercent = item?.payload?.realPercent ?? 0;
                  const label = item?.payload?.name ?? "";
                  return [
                    `${original.toFixed(2)} bs (${realPercent.toFixed(2)}% del máximo)`,
                    label,
                  ];
                }}
              />

              <Bar dataKey="normalized" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recuadro Totales (valores reales) */}
        <div className="border-2 border-black rounded-xl p-4 w-[230px] h-fit shadow-lg bg-white">
          <p className="font-semibold text-lg">
            Ingresos: {ingresosTotal.toFixed(2)} bs
          </p>
          <p className="font-semibold text-lg">
            Recargas: {recargasTotal.toFixed(2)} bs
          </p>
          <p className="font-semibold text-lg">
            Retiros: {retirosTotal.toFixed(2)} bs
          </p>
        </div>
      </div>
    </div>
  );
}
