export type GuideBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] };

export interface GuideSection {
  heading: string;
  /**
   * Contenido de la sección como bloques ordenados. Los textos de tipo
   * "paragraph"/"list" admiten enlaces en formato `[texto](href)`, que la
   * página los convierte en <Link>.
   */
  blocks: GuideBlock[];
}

export interface GuideFaqEntry {
  question: string;
  answer: string;
}

interface GuideBase {
  slug: string;
  title: string;
  /** Una frase, para la tarjeta del listado y la meta description. */
  description: string;
  /** Mostrado en la página para transmitir vigencia (ej. "julio de 2026"). */
  lastUpdated: string;
  sections: GuideSection[];
  faqEntries: GuideFaqEntry[];
  /** Slugs de lib/glossary.ts a enlazar al final de la guía. */
  relatedGlossarySlugs: string[];
  /** Sustituye el disclaimer genérico de cierre si se necesita uno más explícito. */
  disclaimer?: string;
}

/**
 * "guia": contenido de referencia evergreen, sin fecha de publicación obligatoria.
 * "articulo": pieza de blog con fecha de publicación fija (`publishedDate` obligatorio).
 */
export type Guide =
  | (GuideBase & { category: "guia"; publishedDate?: string })
  | (GuideBase & { category: "articulo"; publishedDate: string });

/**
 * Fuente única de verdad para las guías: /guias y /guias/[slug]
 * leen de aquí, igual que /glosario lee de lib/glossary.ts.
 */
export const guides: Guide[] = [
  {
    slug: "tributacion-ahorro-inversion-espana",
    category: "guia",
    title: "Cómo tributa el ahorro y la inversión en España (Guía 2026)",
    description:
      "Guía completa sobre el IRPF del ahorro: tramos, traspaso de fondos sin tributar, compensación de pérdidas y cómo afecta a tus inversiones en España.",
    lastUpdated: "julio de 2026",
    sections: [
      {
        heading: "Introducción",
        blocks: [
          {
            type: "paragraph",
            text: "Cuando inviertes o ahorras en España, no pagas impuestos solo por tener el dinero invertido: pagas cuando obtienes una ganancia real, ya sea al vender un activo con beneficio, al cobrar dividendos, o al recibir intereses. Esta guía explica de forma práctica cómo funciona esa tributación, qué tramos se aplican, y una particularidad fiscal española que marca una diferencia real en cómo inviertes: el traspaso de fondos sin tributar.",
          },
          {
            type: "paragraph",
            text: "Esta guía es información general y educativa, no asesoramiento fiscal personalizado. Tu situación puede tener matices (residencia autonómica, patrimonio, otras rentas) que cambien el resultado exacto — para tu declaración de la renta, consulta siempre con un asesor fiscal o Hacienda.",
          },
        ],
      },
      {
        heading: "Qué es la base imponible del ahorro",
        blocks: [
          {
            type: "paragraph",
            text: "En España, el [IRPF](/glosario/irpf) distingue dos grandes bloques de renta: la base general (tu salario, alquileres que cobras, etc.) y la [base imponible del ahorro](/glosario/base-imponible-del-ahorro), que es la que te afecta como inversor. La base del ahorro incluye:",
          },
          {
            type: "list",
            items: [
              "Intereses de cuentas remuneradas y depósitos",
              "Dividendos de acciones",
              "Ganancias (o pérdidas) al vender fondos de inversión, acciones, ETF u otros activos financieros",
            ],
          },
          {
            type: "paragraph",
            text: "Esta base tributa con una escala propia, distinta e independiente de la de tu salario — no se suma a tu sueldo para calcular el tramo, tiene su propia progresividad.",
          },
        ],
      },
      {
        heading: "Tramos del IRPF del ahorro (2025-2026)",
        blocks: [
          {
            type: "table",
            caption: "Tramos del IRPF del ahorro en España y tipo aplicable según el importe de la ganancia",
            headers: ["Hasta (€)", "Tipo aplicable"],
            rows: [
              ["0 – 6.000", "19%"],
              ["6.000 – 50.000", "21%"],
              ["50.000 – 200.000", "23%"],
              ["200.000 – 300.000", "27%"],
              ["Más de 300.000", "30%"],
            ],
          },
          {
            type: "paragraph",
            text: "Estos tramos son progresivos, igual que en la base general: no pagas el tipo más alto sobre todo tu importe, solo sobre la parte que cae dentro de cada tramo. Por ejemplo, si tienes una ganancia de 10.000 €, pagas el 19% sobre los primeros 6.000 € y el 21% sobre los 4.000 € restantes — no el 21% sobre los 10.000 € completos.",
          },
          {
            type: "paragraph",
            text: "Importante: el último tramo subió del 28% al 30% desde el 1 de enero de 2025 (Ley 7/2024), y se mantiene igual para 2026. Mucho contenido en internet todavía refleja el tipo antiguo del 28% — esta guía está actualizada a los tipos vigentes.",
          },
        ],
      },
      {
        heading: "Ejemplo con euros reales",
        blocks: [
          {
            type: "paragraph",
            text: "Has vendido participaciones de un fondo con una ganancia de 15.000 €:",
          },
          {
            type: "list",
            items: [
              "Primeros 6.000 € al 19% = 1.140 €",
              "Siguientes 9.000 € (hasta 15.000 €) al 21% = 1.890 €",
              "Total a pagar: 3.030 €",
              "Ganancia neta después de impuestos: 11.970 €",
              "Tipo efectivo real: 20,2% (no el 21% del tramo marginal)",
            ],
          },
          {
            type: "paragraph",
            text: "Con una ganancia mayor, la progresividad se nota todavía más. Si la ganancia es de 60.000 €, tributa cruzando tres tramos:",
          },
          {
            type: "list",
            items: [
              "Primeros 6.000 € al 19% = 1.140 €",
              "Siguientes 44.000 € (hasta 50.000 €) al 21% = 9.240 €",
              "Últimos 10.000 € (hasta 60.000 €) al 23% = 2.300 €",
              "Total a pagar: 12.680 €",
              "Ganancia neta después de impuestos: 47.320 €",
              "Tipo efectivo real: 21,1% (por debajo del 23% del tramo marginal)",
            ],
          },
        ],
      },
      {
        heading: "El traspaso de fondos: la ventaja fiscal más importante que casi nadie explica bien",
        blocks: [
          {
            type: "paragraph",
            text: "Si inviertes en fondos de inversión (incluidos los [fondos indexados](/glosario/fondo-indexado)), tienes una ventaja fiscal que no existe si inviertes directamente en acciones o [ETF](/glosario/etf): puedes hacer un [traspaso de fondos](/glosario/traspaso-de-fondos) de un fondo a otro sin tributar por la ganancia, siempre que el traspaso se haga entre fondos y no retires el dinero como efectivo.",
          },
          {
            type: "paragraph",
            text: "Esto significa que puedes cambiar de estrategia, de gestora, o rebalancear tu cartera de fondos sin generar una factura fiscal inmediata — el impuesto se paga solo cuando finalmente retiras el dinero del ecosistema de fondos hacia tu cuenta bancaria.",
          },
          {
            type: "paragraph",
            text: "Con ETF y acciones, en cambio, cada venta genera una ganancia o pérdida computable de inmediato, aunque reinviertas el dinero al momento en otro activo.",
          },
          {
            type: "paragraph",
            text: "Esta diferencia es una de las razones por las que muchos inversores a largo plazo en España prefieren estructurar su cartera con fondos de inversión (incluidos los indexados) en vez de ETF, a pesar de que los ETF a veces tienen [comisiones ligeramente más bajas](/calculadoras/coste-comisiones) — el ahorro fiscal de poder reajustar sin tributar puede compensar esa diferencia con el tiempo.",
          },
        ],
      },
      {
        heading: "Compensación de pérdidas y ganancias",
        blocks: [
          {
            type: "paragraph",
            text: "Si en el mismo año fiscal tienes ganancias con algunos activos y pérdidas con otros, Hacienda te permite compensarlas entre sí antes de calcular cuánto pagas. Por ejemplo, si ganaste 5.000 € vendiendo un fondo y perdiste 2.000 € vendiendo acciones, tributas solo por los 3.000 € netos.",
          },
          {
            type: "paragraph",
            text: "Si las pérdidas superan a las ganancias en un año, puedes compensar el exceso con ganancias de los 4 años siguientes.",
          },
        ],
      },
      {
        heading: "Retenciones vs. lo que realmente pagas",
        blocks: [
          {
            type: "paragraph",
            text: "Cuando cobras dividendos o vendes un fondo con ganancia, el banco o la gestora suele aplicarte una retención a cuenta (habitualmente el 19%, el tipo del primer tramo) antes de darte el dinero. Esa retención no es necesariamente lo que acabas pagando de verdad: es un adelanto.",
          },
          {
            type: "paragraph",
            text: "La cantidad final se ajusta en tu declaración de la renta del año siguiente, donde puedes acabar pagando más (si tu ganancia total supera el primer tramo) o te devuelven la diferencia (si la retención fue mayor de lo que correspondía).",
          },
        ],
      },
    ],
    faqEntries: [
      {
        question: "¿Pago impuestos solo por tener dinero invertido, aunque no venda nada?",
        answer:
          "No. Mientras no vendas un activo con ganancia, ni cobres dividendos o intereses, no hay nada que declarar por esa inversión. El impuesto se genera al obtener una ganancia real, no por el simple hecho de tener el dinero invertido.",
      },
      {
        question: "¿Qué pasa si vendo con pérdidas?",
        answer:
          "Si vendes con pérdidas, no pagas impuestos por esa operación, y además puedes usar esa pérdida para compensar ganancias de otras inversiones del mismo año o de los 4 años siguientes.",
      },
      {
        question: "¿Los tramos del ahorro dependen de mi comunidad autónoma?",
        answer:
          "No. A diferencia de la base general (salario), la base del ahorro tiene una escala única para toda España, sin variación autonómica.",
      },
      {
        question: "¿Puedo evitar pagar impuestos reinvirtiendo mis ganancias?",
        answer:
          "Con fondos de inversión, sí puedes diferir el pago mientras traspases el dinero entre fondos sin retirarlo. Con acciones o ETF, no — cada venta con ganancia tributa en el momento, independientemente de si reinviertes el dinero después.",
      },
      {
        question: "¿Esta guía sustituye a un asesor fiscal?",
        answer:
          "No. Esta guía explica el funcionamiento general de la fiscalidad del ahorro en España, pero tu situación concreta puede tener particularidades (patrimonio, otras rentas, deducciones) que cambien el resultado. Para tu declaración de la renta, consulta siempre con un asesor fiscal.",
      },
    ],
    relatedGlossarySlugs: ["irpf", "base-imponible-del-ahorro", "traspaso-de-fondos", "fondo-indexado", "etf"],
    disclaimer:
      "Esta guía tiene fines educativos y no constituye asesoramiento fiscal personalizado. La normativa fiscal puede cambiar y tu situación particular puede diferir de los ejemplos aquí mostrados. Antes de tomar decisiones basadas en implicaciones fiscales, consulta con un asesor fiscal cualificado o con la Agencia Tributaria.",
  },
];
