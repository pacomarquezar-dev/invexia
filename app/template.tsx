/**
 * Se remonta en cada navegación (a diferencia de layout.tsx), lo que
 * dispara el fundido de entrada en cada cambio de página. El wrapper
 * reproduce el flex-1/flex-col de <body> para no romper el layout de
 * footer pegado al fondo en páginas de poco contenido (ej. 404).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-fade-in flex flex-1 flex-col">{children}</div>;
}
