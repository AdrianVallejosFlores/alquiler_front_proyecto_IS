import { OfertaTrabajo } from "../interfaces/Oferta.interface";

export function validarOferta(data: OfertaTrabajo): string | null {
  if (!data.titulo.trim()) return "Debe ingresar un título.";
  if (!data.descripcion.trim()) return "Debe ingresar una descripción.";
  if (!data.fotoPortada) return "Debe cargar una foto de portada.";
  return null; // ✔ valido
}
