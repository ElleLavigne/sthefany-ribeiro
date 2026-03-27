"use client";

import { useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@config/firebase-storage";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
}

export function ImageUpload({ images, onChange, folder = "products" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (fileArray.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of fileArray) {
      const timestamp = Date.now();
      const safeName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9.]/gi, "-")
        .toLowerCase();
      const path = `${folder}/${timestamp}-${safeName}`;
      const storageRef = ref(storage, path);

      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      newUrls.push(url);
    }

    onChange([...images, ...newUrls]);
    setUploading(false);

    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  function handleRemove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function handleReorder(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    const reordered = [...images];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    onChange(reordered);
  }

  return (
    <div className="space-y-3">
      {/* Preview das imagens */}
      {images.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="relative group">
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                <img
                  src={url}
                  alt={`Imagem ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badge da imagem principal */}
              {i === 0 && (
                <span className="absolute -top-2 -left-2 bg-brand-olive text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                  Capa
                </span>
              )}

              {/* Controles */}
              <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(i, i - 1)}
                    className="w-6 h-6 bg-white rounded-full text-stone-600 text-xs flex items-center justify-center hover:bg-stone-100"
                    title="Mover para esquerda"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="w-6 h-6 bg-white rounded-full text-red-700 text-xs flex items-center justify-center hover:bg-red-50"
                  title="Remover"
                >
                  ×
                </button>
                {i < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(i, i + 1)}
                    className="w-6 h-6 bg-white rounded-full text-stone-600 text-xs flex items-center justify-center hover:bg-stone-100"
                    title="Mover para direita"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Área de upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-brand-olive bg-brand-olive/5"
            : "border-stone-300 hover:border-stone-400"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) uploadFiles(e.target.files);
          }}
        />

        {uploading ? (
          <p className="text-sm text-stone-400">Enviando imagens...</p>
        ) : (
          <>
            <p className="text-sm font-medium text-stone-600">
              Clique ou arraste imagens aqui
            </p>
            <p className="text-xs text-stone-400 mt-1">
              JPG, PNG ou WebP
            </p>
          </>
        )}
      </div>
    </div>
  );
}
