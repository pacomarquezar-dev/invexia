"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Calculator, Coffee, Info, Menu, Newspaper, UserCheck, X } from "lucide-react";
import { KOFI_URL } from "@/lib/kofi";
import Card from "@/components/Card";

const menuLinkClasses =
  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:bg-foreground/5 hover:text-accent";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isOpen) {
      firstLinkRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  function handleLinkClick() {
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative md:hidden">
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={menuId}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-foreground/5"
      >
        {isOpen ? (
          <X aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Menu aria-hidden="true" className="h-5 w-5" />
        )}
        <span className="sr-only">{isOpen ? "Cerrar menú" : "Abrir menú"}</span>
      </button>

      {isOpen && (
        <Card
          id={menuId}
          as="section"
          aria-label="Navegación principal"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-20 flex w-56 max-w-[calc(100vw-3rem)] flex-col gap-1 p-2"
        >
          <Link ref={firstLinkRef} href="/calculadoras" className={menuLinkClasses} onClick={handleLinkClick}>
            <Calculator aria-hidden="true" className="h-4 w-4" />
            Calculadoras
          </Link>
          <Link href="/perfil-inversor" className={menuLinkClasses} onClick={handleLinkClick}>
            <UserCheck aria-hidden="true" className="h-4 w-4" />
            Test de perfil
          </Link>
          <Link href="/glosario" className={menuLinkClasses} onClick={handleLinkClick}>
            <BookOpen aria-hidden="true" className="h-4 w-4" />
            Glosario
          </Link>
          <Link href="/guias" className={menuLinkClasses} onClick={handleLinkClick}>
            <Newspaper aria-hidden="true" className="h-4 w-4" />
            Guías
          </Link>
          <Link href="/sobre" className={menuLinkClasses} onClick={handleLinkClick}>
            <Info aria-hidden="true" className="h-4 w-4" />
            Sobre
          </Link>
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={menuLinkClasses}
            onClick={handleLinkClick}
          >
            <Coffee aria-hidden="true" className="h-4 w-4" />
            Invítame a un café
          </a>
        </Card>
      )}
    </div>
  );
}
