"use client";

import React, { useState } from "react";
import Image from "next/image"; // Importa el componente Image de Next.js

interface Props {
  id: string;
  label: string;
  multiple?: boolean;
  maxFiles?: number; // Añadimos un parámetro para el máximo de archivos
  onSelect: (files: FileList) => void;
}

export default function InputFile({ id, label, multiple, maxFiles = 5, onSelect }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]); // Para manejar múltiples imágenes
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Para manejar los errores
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para la modal de imagen ampliada
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Imagen seleccionada para mostrar en grande

  const openFile = () => document.getElementById(id)?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (files.length > maxFiles) {
        alert(`Solo puedes cargar hasta ${maxFiles} archivos.`);
        return;
      }

      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!validImageTypes.includes(file.type)) {
          setErrorMessage("Solo se pueden cargar imágenes (jpg, jpeg, png).");
          return;
        }
      }

      setErrorMessage(null); 
      onSelect(files);

      if (multiple) {
        const fileArray = Array.from(files);
        const newPreviews = fileArray.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews].slice(0, maxFiles));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(files[0]);
      }
    }
  };

  const handleRemove = (index: number) => {
    if (multiple) {
      const updatedPreviews = [...previews];
      updatedPreviews.splice(index, 1);
      setPreviews(updatedPreviews);
    } else {
      setPreview(null);
    }
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col items-start w-full mt-4">
      <div className="flex justify-between w-full">
        <span className="font-bold Poppins text-[17px]">{label}</span>
        <button
          type="button"
          onClick={openFile}
          className="bg-[#0C4FE9] text-white px-6 py-2 rounded-md Poppins font-semibold hover:brightness-110"
        >
          Cargar
        </button>
      </div>

      <div className="w-full mt-2">
        <input
          id={id}
          type="file"
          multiple={multiple}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Previsualización de la imagen para Foto portada (única imagen) */}
        {!multiple && preview && (
          <div className="mt-3 relative w-max">
            <Image 
              src={preview} 
              alt="Preview" 
              className="max-w-[150px] max-h-[150px] rounded-md cursor-pointer"
              width={150} 
              height={150} 
              onClick={() => openModal(preview)} // Al hacer clic, abrir la imagen en grande
            />
            <button
              onClick={() => handleRemove(0)}
              className="absolute top-0 right-0 text-white bg-[#F1F1F1] rounded-full p-2 hover:bg-[#E0E0E0] transition-all"
            >
              <span className="text-black">X</span> {/* Aquí cambiamos el color de la X a negro */}
            </button>
          </div>
        )}

        {/* Previsualización de imágenes para Más fotos (máximo 5 fotos) */}
        {multiple && previews.length > 0 && (
          <div className="mt-3 grid grid-cols-5 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <Image 
                  src={preview} 
                  alt="Preview" 
                  className="max-w-[150px] max-h-[150px] rounded-md cursor-pointer"
                  width={150} 
                  height={150} 
                  onClick={() => openModal(preview)} // Al hacer clic, abrir la imagen en grande
                />
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute top-0 right-0 text-white bg-[#F1F1F1] rounded-full p-2 hover:bg-[#E0E0E0] transition-all"
                >
                  <span className="text-black">X</span> {/* Cambié el color de la X a negro */}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mover el mensaje de error aquí, sobre los botones */}
      {errorMessage && (
        <div className="mt-6 border px-4 py-3 rounded-md text-center text-[16px] bg-[#FFE3E3] text-[#FF4D4D]">
          {errorMessage}
        </div>
      )}

      {/* Modal para ver la imagen en grande */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-md">
            <Image
              src={selectedImage!}
              alt="Full-screen preview"
              width={500}
              height={500}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-black rounded-full p-2"
            >
              <span className="text-white">X</span> {/* Cambié el color de la X a negro */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
