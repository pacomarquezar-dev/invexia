export interface GuideSection {
  heading: string;
  /** Cada elemento es un párrafo independiente. */
  body: string[];
}

export interface GuideFaqEntry {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  title: string;
  /** Una frase, para la tarjeta del listado y la meta description. */
  description: string;
  sections: GuideSection[];
  faqEntries: GuideFaqEntry[];
  /** Slugs de lib/glossary.ts a enlazar al final de la guía. */
  relatedGlossarySlugs: string[];
}

/**
 * Fuente única de verdad para las guías: /guias y /guias/[slug]
 * leen de aquí, igual que /glosario lee de lib/glossary.ts.
 */
export const guides: Guide[] = [
  {
    slug: "guia-de-prueba",
    title: "Guía de prueba",
    description:
      "Guía de placeholder usada solo para verificar que la ruta /guias/[slug] renderiza correctamente antes de escribir contenido real.",
    sections: [
      {
        heading: "Esto es una sección de prueba",
        body: [
          "Este texto es de relleno: sirve únicamente para comprobar que la plantilla de guía renderiza correctamente un encabezado y un párrafo dentro de una tarjeta.",
          "Cuando llegue el contenido real, esta guía se sustituirá por la primera guía de fiscalidad del ahorro y la inversión en España.",
        ],
      },
    ],
    faqEntries: [
      {
        question: "¿Es esta guía contenido real?",
        answer:
          "No. Es una guía de prueba para verificar el flujo de renderizado de la sección de guías antes de publicar contenido definitivo.",
      },
    ],
    relatedGlossarySlugs: [],
  },
];
