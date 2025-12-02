"use client";
import React, { useState } from "react";
import { mesesNombres, diasSemanaCortos } from "./constantes"; // Asegúrate que la ruta sea correcta
import Horario from "./horarios"; // Asegúrate que la ruta sea correcta

// 1. Definimos qué datos necesita recibir este componente desde el padre
interface CalendarioProps {
  proveedorId: string;
  nombreProveedor: string;
  profesionProveedor: string;
}

// 2. Recibimos las props
const Calendario: React.FC<CalendarioProps> = ({ proveedorId, nombreProveedor, profesionProveedor }) => {
  const [mostrarHorarios, setMostrarHorarios] = useState(false);

  const hoy = new Date();
  const [currentMonth, setCurrentMonth] = useState(hoy.getMonth());
  const [currentYear, setCurrentYear] = useState(hoy.getFullYear());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  
  // NOTA: Eliminamos el useEffect que cargaba la info del proveedor
  // porque ahora la recibimos directamente desde la página del Fixer.

  const getDaysInMonth = (month: number, year: number): number =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month: number, year: number): number => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const isToday = (date1: Date, date2: Date): boolean =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const seleccionarFecha = (day: number) => {
    const nuevaFecha = new Date(currentYear, currentMonth, day);
    setFechaSeleccionada(nuevaFecha);
  };

  const mesAnterior = () => {
    let nuevoMes = currentMonth - 1;
    let nuevoAnio = currentYear;
    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio--;
    }
    setCurrentMonth(nuevoMes);
    setCurrentYear(nuevoAnio);
    setFechaSeleccionada(null);
  };

  const mesSiguiente = () => {
    let nuevoMes = currentMonth + 1;
    let nuevoAnio = currentYear;
    if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio++;
    }
    setCurrentMonth(nuevoMes);
    setCurrentYear(nuevoAnio);
    setFechaSeleccionada(null);
  };

  const handleSiguiente = () => {
    if (fechaSeleccionada) {
      setMostrarHorarios(true);
    }
  };

  const generarDias = (): React.ReactElement[] => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const celdas: React.ReactElement[] = [];

    for (let i = 0; i < firstDay; i++) {
      celdas.push(<div key={`empty-${i}`} className="w-full h-14 md:h-20"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const fecha = new Date(currentYear, currentMonth, day);
      fecha.setHours(0, 0, 0, 0);
      const isCurrentDay = isToday(fecha, today);
      const esPasado = fecha < today && !isCurrentDay;
      const isSelected = fechaSeleccionada && isToday(fecha, fechaSeleccionada);

      let clases = "w-full h-14 md:h-20 flex items-center justify-center rounded-lg font-bold transition-all duration-200 text-lg cursor-pointer ";

      if (esPasado) {
        clases += "bg-gray-200 text-gray-400 cursor-not-allowed";
      } else if (isSelected) {
        clases += "bg-blue-700 text-white ring-4 ring-blue-600 scale-105 shadow-lg";
      } else {
        clases += "bg-blue-400 text-white hover:bg-blue-500 hover:scale-105 shadow-md";
      }

      celdas.push(
        <div
          key={day}
          className={clases}
          onClick={() => !esPasado && seleccionarFecha(day)}
        >
          {day}
        </div>
      );
    }

    return celdas;
  };

  if (mostrarHorarios && fechaSeleccionada) {
    return (
      <Horario
        fechaSeleccionada={fechaSeleccionada}
        proveedorId={proveedorId} // Usamos el ID real
        infoProveedor={{ nombre: nombreProveedor, profesion: profesionProveedor, descripcion: "" }}
        onVolver={() => {
          setFechaSeleccionada(null);
          setMostrarHorarios(false);
        }}
      />
    );
  }

  // 3. Limpiamos el contenedor: Quitamos 'min-h-screen', 'bg-white' externo y paddings excesivos
  //    para que se adapte al contenedor padre.
  return (
    <div className="w-full">
      <div className="mb-6">
         <h2 className="text-xl font-bold text-slate-900 mb-2">Agendar servicio</h2>
         <p className="text-slate-500 text-sm">Selecciona una fecha disponible para contratar a {nombreProveedor}.</p>
      </div>

      <div className="bg-white rounded-xl">
        <div className="flex items-center justify-center gap-8 mb-8">
          <button
            onClick={mesAnterior}
            className="text-blue-600 hover:text-blue-700 transition-all hover:bg-blue-50 rounded-lg p-2"
            aria-label="Mes anterior"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800 min-w-[200px] text-center">
            {mesesNombres[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={mesSiguiente}
            className="text-blue-600 hover:text-blue-700 transition-all hover:bg-blue-50 rounded-lg p-2"
            aria-label="Mes siguiente"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-3 mb-4">
          {diasSemanaCortos.map((dia, index) => (
            <div
              key={index}
              className="text-center font-bold text-gray-700 text-xs md:text-base py-2 md:py-3 bg-blue-50 rounded-lg"
            >
              {dia.substring(0, 3)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-3 mb-8">
          {generarDias()}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSiguiente}
            disabled={!fechaSeleccionada}
            className="px-8 md:px-20 py-3 rounded-lg text-base font-bold transition-all shadow-lg bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendario;