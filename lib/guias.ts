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
  {
    slug: "cuanto-ahorrar-segun-tu-edad",
    category: "articulo",
    title: "¿Cuánto deberías tener ahorrado según tu edad? (España, 2026)",
    description:
      "Referencias orientativas de ahorro e inversión por edad, adaptadas a España, con ejemplos reales calculados con nuestra calculadora de objetivo de ahorro.",
    publishedDate: "17 de julio de 2026",
    lastUpdated: "julio de 2026",
    sections: [
      {
        heading: "Introducción",
        blocks: [
          {
            type: "paragraph",
            text: "Es una de las preguntas que más ansiedad genera en finanzas personales: «¿voy bien para mi edad?». La respuesta honesta es que no existe una cifra oficial ni una respuesta única — depende de tu salario, tus gastos, si tienes hijos, si vives de alquiler o con hipoteca, y muchas otras variables. Pero sí existen referencias orientativas útiles, siempre que se usen como brújula, no como examen que aprobar o suspender.",
          },
        ],
      },
      {
        heading: "La referencia más conocida: la regla de Fidelity",
        blocks: [
          {
            type: "paragraph",
            text: "Una de las guías más citadas internacionalmente es la de Fidelity Investments, que expresa el objetivo de ahorro como múltiplos de tu salario anual:",
          },
          {
            type: "table",
            caption: "Múltiplo del salario anual recomendado como ahorro acumulado, según la edad, propuesto por Fidelity Investments",
            headers: ["Edad", "Múltiplo de tu salario anual"],
            rows: [
              ["30 años", "1 vez"],
              ["35 años", "2 veces"],
              ["40 años", "3 veces"],
              ["45 años", "4 veces"],
              ["50 años", "6 veces"],
              ["55 años", "7 veces"],
              ["60 años", "8 veces"],
              ["67 años", "10 veces"],
            ],
          },
          {
            type: "paragraph",
            text: "Es importante el matiz: esta referencia está pensada para el sistema de pensiones de EE. UU., donde el ahorro privado tiene que cubrir una parte mayor de la jubilación que en España, donde la pensión pública cubre una parte más grande del reemplazo de ingresos. Así que estas cifras son útiles como orientación de magnitud, pero probablemente son más ambiciosas de lo estrictamente necesario para alguien que va a cobrar una pensión pública española.",
          },
        ],
      },
      {
        heading: "Cuánto ahorra realmente la gente en España",
        blocks: [
          {
            type: "paragraph",
            text: "El salario neto medio en España ronda actualmente los 1.400-1.600 € mensuales, según la fuente y el año de referencia. Con ese nivel de ingresos, y con el peso que tienen la vivienda y el día a día en el presupuesto de la mayoría de los hogares, no es sorprendente que el ahorro real de gran parte de la población quede muy por debajo de referencias como la de Fidelity.",
          },
          {
            type: "paragraph",
            text: "Esto no es un fracaso individual: es, en gran medida, un reflejo del margen real que deja un salario medio una vez cubiertos los gastos esenciales. Tiene más sentido usar estas referencias como horizonte hacia el que avanzar de forma progresiva que como un listón que hay que alcanzar ya.",
          },
        ],
      },
      {
        heading: "Ejemplo con la calculadora de objetivo de ahorro",
        blocks: [
          {
            type: "paragraph",
            text: "Vamos a verlo con números reales, usando nuestra [calculadora de objetivo de ahorro](/calculadoras/objetivo-ahorro). Imagina a alguien de 25 años con un salario neto de 1.500 €/mes (18.000 €/año) que quiere llegar a los 35 años con el equivalente a 2 veces su salario anual ahorrado e invertido: 36.000 €, en un plazo de 10 años, con una rentabilidad esperada del 7% anual y sin capital inicial de partida.",
          },
          {
            type: "paragraph",
            text: "Con estos datos, la aportación mensual necesaria para llegar al objetivo es de unos 208 €/mes. Sobre un salario neto de 1.500 €/mes, eso supone cerca del 14% del ingreso mensual — una cifra exigente pero realista si se automatiza desde el principio, sin depender de «lo que sobre» a final de mes.",
          },
          {
            type: "paragraph",
            text: "De esos 36.000 € finales, unos 24.959 € proceden de las aportaciones propias y el resto, unos 11.041 €, proviene de la rentabilidad generada por la inversión a lo largo de los 10 años: casi un tercio del objetivo lo pone el propio crecimiento del dinero invertido, no el bolsillo.",
          },
        ],
      },
      {
        heading: "Qué hacer si vas «por detrás» de estas referencias",
        blocks: [
          {
            type: "paragraph",
            text: "El tiempo importa más que el punto de partida. Si tienes 35 años y no tienes nada ahorrado, no significa que sea tarde — significa que el momento de empezar es ahora, no cuando «tengas más margen». Cada año que se retrasa el inicio no solo se pierde ese año de aportaciones: se pierde también el tiempo de [interés compuesto](/glosario/interes-compuesto) sobre esas aportaciones, que es el factor que más pesa a largo plazo.",
          },
        ],
      },
    ],
    faqEntries: [
      {
        question: "¿Estas cifras incluyen la vivienda habitual?",
        answer:
          "No. Las referencias de este tipo normalmente se refieren a ahorro e inversión financiera (cuentas, fondos, planes de pensiones), no al valor de la vivienda en la que vives, ya que no es un activo líquido que puedas usar para tu jubilación sin venderla o hipotecarla.",
      },
      {
        question: "¿Qué pasa si tengo deudas?",
        answer:
          "Antes de perseguir objetivos de ahorro a largo plazo, suele tener sentido priorizar eliminar deudas con intereses altos (como las de tarjetas de crédito), ya que el coste de esa deuda normalmente supera cualquier rentabilidad razonable que puedas obtener invirtiendo.",
      },
      {
        question: "¿Estas referencias sirven igual para autónomos?",
        answer:
          "Los autónomos en España suelen tener una pensión pública futura más baja que los asalariados con la misma base de cotización, por lo que en muchos casos conviene apuntar a objetivos de ahorro más altos que las referencias generales, para compensar esa diferencia.",
      },
      {
        question: "¿Es mejor centrarme en ahorrar o en invertir?",
        answer:
          "Depende del plazo: para un fondo de emergencia (3-6 meses de gastos) que necesitas tener disponible en cualquier momento, prioriza la liquidez. Para objetivos a más largo plazo (10 años o más), invertir suele tener sentido para que el dinero no pierda poder adquisitivo frente a la inflación.",
      },
      {
        question: "¿Cómo sé cuánto necesito ahorrar cada mes para llegar a mi objetivo?",
        answer:
          "Puedes calcularlo exactamente con nuestra [calculadora de objetivo de ahorro](/calculadoras/objetivo-ahorro), indicando tu meta, el plazo y la rentabilidad esperada.",
      },
    ],
    relatedGlossarySlugs: ["liquidez", "interes-compuesto"],
    disclaimer:
      "Este artículo tiene fines educativos y no constituye asesoramiento financiero personalizado. Las referencias de ahorro por edad son orientativas y no están ajustadas a tu situación concreta (salario, gastos, dependientes, vivienda). Antes de tomar decisiones financieras importantes, valora tu caso particular o consulta con un profesional cualificado.",
  },
  {
    slug: "amortizar-hipoteca-o-invertir",
    category: "articulo",
    title: "¿Amortizar hipoteca o invertir? Cómo decidir con números reales",
    description:
      "Comparación con datos reales entre amortizar anticipadamente tu hipoteca e invertir ese dinero, según el tipo de interés de tu préstamo.",
    publishedDate: "17 de julio de 2026",
    lastUpdated: "julio de 2026",
    sections: [
      {
        heading: "Introducción",
        blocks: [
          {
            type: "paragraph",
            text: "Es una de las decisiones financieras más comunes en España, y también una de las que más se decide «por sensación» en vez de con números: si tienes dinero de sobra, ¿lo destinas a amortizar anticipadamente tu hipoteca, o lo inviertes? La respuesta matemática es más sencilla de lo que parece — aunque la respuesta correcta para ti no sea solo matemática.",
          },
        ],
      },
      {
        heading: "La comparación matemática básica",
        blocks: [
          {
            type: "paragraph",
            text: "La lógica central es esta: amortizar anticipadamente tu hipoteca es equivalente a obtener una rentabilidad garantizada igual al [tipo de interés](/glosario/tin) de tu préstamo. Si tu hipoteca está al 3% TIN, cada euro que amortizas anticipadamente «rinde» un 3% garantizado, libre de riesgo, porque dejas de pagar esos intereses.",
          },
          {
            type: "paragraph",
            text: "Si esperas conseguir con una inversión una rentabilidad superior a ese 3% de forma sostenida, matemáticamente sale mejor invertir. Si no confías en superar esa rentabilidad, o prefieres la certeza absoluta frente al riesgo, amortizar es la opción más segura.",
          },
          {
            type: "paragraph",
            text: "Como referencia, en julio de 2026 el tipo medio de las hipotecas fijas en España ronda el 2,86% TIN según el INE, con ofertas competitivas por debajo del 2,5%. Un fondo indexado global ha rentado históricamente entre el 6% y el 8% anual a largo plazo — sin garantía de que se repita en el futuro, a diferencia del ahorro de intereses de amortizar, que sí es una certeza.",
          },
        ],
      },
      {
        heading: "Ejemplo con euros reales",
        blocks: [
          {
            type: "paragraph",
            text: "Imagina que tienes 10.000 € disponibles y dudas entre amortizar tu hipoteca (al 3% TIN) o invertirlos. Si los inviertes con una rentabilidad esperada del 7% anual durante 15 años, sin aportaciones adicionales, el capital final —calculado con la misma fórmula que usa nuestra [calculadora de interés compuesto](/calculadoras/interes-compuesto)— es de 28.489,47 €: un beneficio de 18.489,47 € sobre los 10.000 € iniciales. Esto es un cálculo exacto de interés compuesto.",
          },
          {
            type: "paragraph",
            text: "El otro lado de la comparación no se puede calcular con la misma exactitud: el ahorro real que consigues amortizando anticipadamente depende del cuadro de amortización francés concreto de tu hipoteca (cómo se reparten capital e intereses en cada cuota, cuántos años te quedan, si reduces cuota o plazo), no solo del tipo de interés nominal. Como aproximación simplificada —y solo como aproximación, no como una simulación real de tu cuadro de amortización— podemos tratar el 3% TIN como si fuera una rentabilidad compuesta garantizada sobre esos mismos 10.000 € durante los mismos 15 años: eso da un ahorro de intereses estimado de unos 5.674,32 €.",
          },
          {
            type: "paragraph",
            text: "Con estos números, invertir sale matemáticamente por delante: unos 18.489 € de beneficio frente a unos 5.674 € de ahorro de intereses estimado, una diferencia de casi 12.815 €. Pero esa comparación asume que consigues sostener el 7% de rentabilidad durante los 15 años completos sin vender en un mal momento, mientras que el ahorro de amortizar es una certeza matemática desde el primer día.",
          },
        ],
      },
      {
        heading: "Cuándo tiene más sentido amortizar, aunque la matemática diga invertir",
        blocks: [
          {
            type: "list",
            items: [
              "Si tu hipoteca es a tipo variable y te preocupa que suban los tipos en el futuro.",
              "Si te genera mucha tranquilidad psicológica no deber dinero, y esa tranquilidad tiene valor real para ti, aunque no sea medible en euros.",
              "Si no tienes aún un fondo de emergencia: antes de invertir o amortizar de más, conviene tener cubiertos 3-6 meses de gastos en algo con buena [liquidez](/glosario/liquidez).",
              "Si tu hipoteca tiene una comisión de amortización anticipada alta, que reduce el beneficio real de amortizar.",
            ],
          },
        ],
      },
      {
        heading: "Cuándo tiene más sentido invertir",
        blocks: [
          {
            type: "list",
            items: [
              "Si tu hipoteca tiene un tipo de interés bajo (por debajo del 3%, por ejemplo) y tienes un horizonte de inversión largo (10 años o más).",
              "Si ya tienes cubierto tu fondo de emergencia.",
              "Si tienes capacidad de asumir la volatilidad de los mercados sin vender en un mal momento por pánico.",
            ],
          },
        ],
      },
    ],
    faqEntries: [
      {
        question: "¿Es lo mismo amortizar capital que amortizar plazo?",
        answer:
          "No. Amortizar capital reduce la cuota mensual manteniendo el plazo, o reduce el plazo manteniendo la cuota — depende de lo que elijas al hacer la amortización. Amortizar reduciendo plazo suele ser matemáticamente más eficiente si tu objetivo es pagar menos intereses totales.",
      },
      {
        question: "¿Hay beneficios fiscales por amortizar la hipoteca?",
        answer:
          "En general, no, salvo para hipotecas anteriores a 2013 que aún conserven derecho a deducción por vivienda habitual bajo el régimen transitorio. Para la gran mayoría de hipotecas actuales, no existe deducción fiscal por amortización anticipada.",
      },
      {
        question: "¿Puedo hacer las dos cosas a la vez?",
        answer:
          "Sí, y de hecho es lo que hace mucha gente: destinar una parte del dinero disponible a amortizar y otra a invertir, en vez de una decisión de todo o nada.",
      },
      {
        question: "¿Qué pasa si mi hipoteca es a tipo variable?",
        answer:
          "El razonamiento es el mismo, pero con más incertidumbre: no sabes con certeza qué tipo de interés vas a pagar en el futuro, así que amortizar una hipoteca variable tiene un componente adicional de protección frente a subidas de tipos que una hipoteca fija no tiene.",
      },
      {
        question: "¿Cómo comparo esto con mi caso concreto?",
        answer:
          "Puedes usar nuestra [calculadora de interés compuesto](/calculadoras/interes-compuesto) para simular cuánto podría crecer tu dinero invertido durante el tiempo que te queda de hipoteca, con la rentabilidad que consideres razonable, y comparar ese resultado con lo que ahorrarías en intereses según el cuadro de amortización de tu banco.",
      },
    ],
    relatedGlossarySlugs: ["interes-compuesto", "liquidez", "tin"],
    disclaimer:
      "Este artículo tiene fines educativos y no constituye asesoramiento financiero ni hipotecario personalizado. La comparación es una simplificación con fines ilustrativos: el ahorro real de amortizar depende del cuadro de amortización concreto de tu hipoteca y las rentabilidades de inversión no están garantizadas. Antes de tomar decisiones importantes, valora tu caso particular o consulta con un profesional cualificado.",
  },
];
