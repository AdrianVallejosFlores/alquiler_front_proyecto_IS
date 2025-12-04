// src/app/components/location/LocationField.tsx
"use client";

import { useState } from "react";
import type { LocationDTO } from "@/types/fixer";
import LocationPicker from "./LocationPicker";
import SelectedMap from "./SelectedMap";

type Props = {
  value: LocationDTO | null;
  onChange: (value: LocationDTO | null) => void;
};

export function LocationField({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-lg font-semibold">
          Establece tu ubicación de trabajo
        </label>
        <p className="text-sm text-gray-600">
          Esta es la zona donde estarás disponible para trabajar; puedes
          actualizarla más adelante.
        </p>
      </div>

      {!value ? (
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white"
          onClick={() => setOpen(true)}
        >
          Añadir mi ubicación
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm">
              <b>Lat:</b> {value.lat.toFixed(6)} | <b>Lng:</b>{" "}
              {value.lng.toFixed(6)}
              {value.address ? (
                <span className="block text-gray-600">
                  <b>Dirección:</b> {value.address}
                </span>
              ) : null}
            </div>

            <button
              className="rounded border px-3 py-2"
              onClick={() => setOpen(true)}
            >
              Cambiar ubicación
            </button>

            <button
              className="rounded px-3 py-2"
              onClick={() => onChange(null)}
            >
              Quitar
            </button>
          </div>
          <SelectedMap lat={value.lat} lng={value.lng} />
        </div>
      )}

      {/* Modal ligero para seleccionar ubicación */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-3xl rounded bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Selecciona ubicación</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded border px-3 py-1 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>

            <div className="mb-3">
              <LocationPicker
                value={
                  value ? { lat: value.lat, lng: value.lng } : undefined
                }
                onChange={(coords) => {
                  // Construimos un LocationDTO mínimo con lat/lng.
                  // Si tu LocationDTO requiere otros campos, añádelos aquí.
                  const loc = {
                    ...(value ?? {}),
                    lat: coords.lat,
                    lng: coords.lng,
                  } as LocationDTO;

                  onChange(loc);
                  setOpen(false);
                }}
                height={400}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded border px-4 py-2"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
