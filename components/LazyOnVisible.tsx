"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyOnVisibleProps {
  children: ReactNode;
  /** Marcador de posición con el mismo alto que el contenido real, para no producir CLS. */
  placeholder: ReactNode;
  /** Margen para empezar a cargar un poco antes de que el elemento entre en pantalla. */
  rootMargin?: string;
}

/**
 * Retrasa el montaje de `children` (y por tanto la carga de su JS, si viene de
 * un next/dynamic) hasta que el contenedor está a punto de entrar en el
 * viewport. Pensado para gráficos pesados (Recharts) que no deben competir
 * por el hilo principal justo después de la carga de la página.
 */
export default function LazyOnVisible({
  children,
  placeholder,
  rootMargin = "200px",
}: LazyOnVisibleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return <div ref={containerRef}>{isVisible ? children : placeholder}</div>;
}
