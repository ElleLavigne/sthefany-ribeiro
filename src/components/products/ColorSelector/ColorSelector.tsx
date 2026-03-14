import { cn } from "@/lib/utils/cn";
import type { ProductColor } from "@/types/product";

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColor: ProductColor | null;
  onChange: (color: ProductColor) => void;
}

export function ColorSelector({ colors, selectedColor, onChange }: ColorSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] tracking-widest uppercase text-[#111111]/60 font-body">
          Cor
        </p>
        {selectedColor && (
          <span className="text-xs text-[#111111] font-body">{selectedColor.name}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-3" role="group" aria-label="Selecione a cor">
        {colors.map((color) => {
          const isSelected = selectedColor?.hex === color.hex;
          return (
            <button
              key={color.hex}
              onClick={() => onChange(color)}
              aria-pressed={isSelected}
              aria-label={`Cor ${color.name}${isSelected ? " — selecionada" : ""}`}
              title={color.name}
              className={cn(
                "w-8 h-8 rounded-full transition-all duration-150 border",
                isSelected
                  ? "ring-2 ring-[#111111] ring-offset-2"
                  : "ring-0 hover:ring-1 hover:ring-[#111111]/40 hover:ring-offset-1",
                color.hex === "#FFFFFF" || color.hex === "#F5F0E8" || color.hex === "#FFFFF0"
                  ? "border-[#E5E5E5]"
                  : "border-transparent"
              )}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}
