"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { BagState, BagAction, BagItem } from "@/types/bag";

// ─── Reducer ────────────────────────────────────────────────────────────────

const BAG_STORAGE_KEY = "sr-bag";

function bagReducer(state: BagState, action: BagAction): BagState {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = itemKey(action.payload);
      const existing = state.items.find((i) => itemKey(i) === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            itemKey(i) === key ? { ...i, quantity: i.quantity + action.payload.quantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM": {
      const key = `${action.payload.productId}-${action.payload.selectedSize}-${action.payload.selectedColor}`;
      return { ...state, items: state.items.filter((i) => itemKey(i) !== key) };
    }

    case "UPDATE_QUANTITY": {
      const key = `${action.payload.productId}-${action.payload.selectedSize}-${action.payload.selectedColor}`;
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => itemKey(i) !== key) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          itemKey(i) === key ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    }

    case "CLEAR_BAG":
      return { ...state, items: [] };

    case "OPEN_BAG":
      return { ...state, isOpen: true };

    case "CLOSE_BAG":
      return { ...state, isOpen: false };

    case "LOAD_FROM_STORAGE":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

function itemKey(item: BagItem | { productId: string; selectedSize: string; selectedColor: string }): string {
  if ("selectedColor" in item && typeof item.selectedColor === "object") {
    return `${item.productId}-${item.selectedSize}-${(item as BagItem).selectedColor.hex}`;
  }
  return `${item.productId}-${item.selectedSize}-${item.selectedColor}`;
}

// ─── Context ────────────────────────────────────────────────────────────────

interface BagContextValue {
  state: BagState;
  dispatch: React.Dispatch<BagAction>;
  addItem: (item: BagItem) => void;
  removeItem: (productId: string, selectedSize: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedSize: string, selectedColor: string, quantity: number) => void;
  clearBag: () => void;
  openBag: () => void;
  closeBag: () => void;
  totalItems: number;
  totalPrice: number;
}

const BagContext = createContext<BagContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

const initialState: BagState = {
  items: [],
  isOpen: false,
};

export function BagProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bagReducer, initialState);

  // Carregar do localStorage na montagem
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BAG_STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as BagItem[];
        dispatch({ type: "LOAD_FROM_STORAGE", payload: items });
      }
    } catch {
      // localStorage indisponível ou dados corrompidos — ignorar silenciosamente
    }
  }, []);

  // Persistir no localStorage quando itens mudam
  useEffect(() => {
    try {
      localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Ignorar erros de quota
    }
  }, [state.items]);

  const addItem = useCallback((item: BagItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((productId: string, selectedSize: string, selectedColor: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, selectedSize, selectedColor } });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, selectedSize: string, selectedColor: string, quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, selectedSize, selectedColor, quantity } });
    },
    []
  );

  const clearBag = useCallback(() => dispatch({ type: "CLEAR_BAG" }), []);
  const openBag = useCallback(() => dispatch({ type: "OPEN_BAG" }), []);
  const closeBag = useCallback(() => dispatch({ type: "CLOSE_BAG" }), []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <BagContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearBag,
        openBag,
        closeBag,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </BagContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useBagContext(): BagContextValue {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error("useBagContext must be used within BagProvider");
  }
  return context;
}
