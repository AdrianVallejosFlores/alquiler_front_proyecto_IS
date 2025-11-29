"use client";

import React from "react";

interface Props {
  id: string;
  label: string;
  multiple?: boolean;
  onSelect: (files: FileList) => void;
}

export default function InputFile({ id, label, multiple, onSelect }: Props) {
  const openFile = () => document.getElementById(id)?.click();

  return (
    <div className="flex items-center justify-between w-full mt-4">
      <span className="font-bold Poppins text-[17px]">{label}</span>

      <div>
        <input
          id={id}
          type="file"
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && onSelect(e.target.files)}
        />

        <button
          type="button"
          onClick={openFile}
          className="bg-[#0C4FE9] text-white px-6 py-2 rounded-md Poppins font-semibold hover:brightness-110"
        >
          Cargar
        </button>
      </div>
    </div>
  );
}
