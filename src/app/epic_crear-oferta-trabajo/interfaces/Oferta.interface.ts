export interface OfertaTrabajo {
  titulo: string;
  descripcion: string;
  fotoPortada: File | null;
  fotosExtra: File[];
  activa: boolean;
}

export interface RespuestaMock {
  success: boolean;
  message: string;
}
