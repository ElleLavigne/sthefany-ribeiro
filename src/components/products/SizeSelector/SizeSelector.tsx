import { cn } from "@/lib/utils/cn";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onChange: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onChange }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] tracking-widest uppercase text-[#111111]/60 font-body">
          Tamanho
        </p>
        {selectedSize && (
          <span className="text-xs text-[#111111] font-body">{selectedSize}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Selecione o tamanho">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              onClick={() => onChange(size)}
              aria-pressed={isSelected}
              aria-label={`Tamanho ${size}${isSelected ? " — selecionado" : ""}`}
              className={cn(
                "min-w-[44px] h-11 px-3 border text-xs tracking-widest font-body transition-all duration-150",
                isSelected
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-[#E5E5E5] text-[#111111] hover:border-[#111111]"
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
