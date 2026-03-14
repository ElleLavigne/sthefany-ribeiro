import "@testing-library/jest-dom";
import React from "react";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    sizes: _sizes,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    [key: string]: unknown;
  }) {
    return React.createElement("img", { src, alt, ...props });
  },
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock next/font/google — Montserrat
jest.mock("next/font/google", () => ({
  Montserrat: () => ({
    className: "mock-montserrat",
    variable: "--font-montserrat",
  }),
  Cormorant_Garamond: () => ({
    className: "mock-cormorant",
    variable: "--font-cormorant",
  }),
  Inter: () => ({
    className: "mock-inter",
    variable: "--font-inter",
  }),
}));
