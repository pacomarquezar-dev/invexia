import { notFound } from "next/navigation";

/**
 * Sin esto, una URL que no coincide con ninguna ruta (typo, enlace roto)
 * no "pertenece" a ningún segmento y Next.js no puede resolver el
 * not-found.tsx personalizado de app/(site)/, mostrando en su lugar el 404
 * genérico sin cabecera ni pie. Al capturar aquí cualquier ruta no
 * reconocida dentro de (site) y llamar a notFound(), forzamos a que sí se
 * resuelva dentro de este grupo — rutas más específicas como /embed/* o
 * /api/* siguen ganando frente a este catch-all.
 */
export default function CatchAllPage() {
  notFound();
}
