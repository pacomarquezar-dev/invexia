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

export interface StudyHeadlineStat {
  /** Etiqueta corta encima del número (ej. "Coste de una comisión alta en 40 años"). */
  label: string;
  /** El dato principal, ya formateado (euros, porcentaje, años...). */
  value: string;
  /** Contexto breve debajo del número (ej. metodología o supuestos en una frase). */
  caption?: string;
}

/**
 * "guia": contenido de referencia evergreen, sin fecha de publicación obligatoria.
 * "articulo": pieza de blog con fecha de publicación fija (`publishedDate` obligatorio).
 * "estudio": mini-estudio con datos propios, con un dato destacado (`headlineStat`)
 * mostrado antes que cualquier otro contenido.
 */
export type Guide =
  | (GuideBase & { category: "guia"; publishedDate?: string })
  | (GuideBase & { category: "articulo"; publishedDate: string })
  | (GuideBase & { category: "estudio"; publishedDate: string; headlineStat: StudyHeadlineStat });

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
  {
    slug: "fondo-de-emergencia-cuanto-y-donde",
    category: "articulo",
    title: "Fondo de emergencia: cuánto necesitas y dónde guardarlo",
    description:
      "Cuánto dinero deberías tener en tu fondo de emergencia, cómo calcularlo con tus gastos reales, y por qué no conviene invertirlo.",
    publishedDate: "17 de julio de 2026",
    lastUpdated: "julio de 2026",
    sections: [
      {
        heading: "Introducción",
        blocks: [
          {
            type: "paragraph",
            text: "Antes de plantearte invertir, amortizar hipoteca, o perseguir cualquier objetivo financiero a largo plazo, hay un paso previo que casi todos los expertos en finanzas personales coinciden en priorizar: tener un fondo de emergencia. Es el dinero que te permite afrontar un imprevisto (perder el trabajo, una avería grande, un gasto médico) sin tener que endeudarte ni vender inversiones en mal momento.",
          },
        ],
      },
      {
        heading: "Cuánto dinero necesitas",
        blocks: [
          {
            type: "paragraph",
            text: "La referencia más habitual es tener entre 3 y 6 meses de gastos esenciales cubiertos. El rango depende de tu situación:",
          },
          {
            type: "list",
            items: [
              "3 meses puede ser suficiente si tienes un empleo estable, ingresos predecibles y/o una segunda fuente de ingresos en el hogar.",
              "6 meses (o incluso más) tiene más sentido si eres autónomo, tienes ingresos variables, o eres la única fuente de ingresos de tu hogar.",
            ],
          },
          {
            type: "paragraph",
            text: "Importante: la referencia es sobre gastos esenciales (vivienda, comida, suministros, seguros, transporte), no sobre tus ingresos totales. Si ganas 2.000 €/mes pero tus gastos esenciales son 1.200 €/mes, tu fondo de emergencia se calcula sobre esos 1.200 €, no sobre los 2.000 €.",
          },
        ],
      },
      {
        heading: "Ejemplo con euros reales",
        blocks: [
          {
            type: "paragraph",
            text: "Imagina que tus gastos esenciales mensuales son 1.200 €, y quieres construir un fondo de emergencia de 6 meses (7.200 €) en un plazo de 18 meses, partiendo de 0 €, usando una cuenta remunerada al 2% —una rentabilidad conservadora y sostenible, ya que las promociones de bienvenida suelen ser más altas pero temporales. Con estos datos, calculados con nuestra [calculadora de objetivo de ahorro](/calculadoras/objetivo-ahorro), la aportación mensual necesaria es de unos 394,36 €/mes durante esos 18 meses.",
          },
          {
            type: "paragraph",
            text: "De esos 7.200 € finales, unos 7.098,54 € proceden de tus propias aportaciones y solo unos 101,46 € vienen de la rentabilidad de la cuenta remunerada: a diferencia de un objetivo de inversión a largo plazo, aquí el rendimiento apenas pesa — el fondo de emergencia se construye casi enteramente con lo que aportas, no con lo que rinde. Es una prueba más de que, para este objetivo, la prioridad no es maximizar rentabilidad, sino disponibilidad y seguridad.",
          },
        ],
      },
      {
        heading: "Dónde guardarlo (y dónde no)",
        blocks: [
          {
            type: "paragraph",
            text: "El fondo de emergencia necesita dos características por encima de todo: disponibilidad inmediata (buena [liquidez](/glosario/liquidez)) y seguridad del capital. La rentabilidad es secundaria — no es dinero que estás invirtiendo para hacerlo crecer, es dinero que estás guardando para que esté ahí cuando lo necesites.",
          },
          {
            type: "paragraph",
            text: "Opciones razonables:",
          },
          {
            type: "list",
            items: [
              "Una cuenta remunerada sin permanencia, donde puedas retirar el dinero en cualquier momento sin penalización.",
              "Una cuenta corriente normal, si prefieres simplicidad sobre unos pocos euros de más al año.",
            ],
          },
          {
            type: "paragraph",
            text: "Lo que normalmente no conviene:",
          },
          {
            type: "list",
            items: [
              "Invertirlo en fondos o acciones: la volatilidad del mercado significa que justo cuando más necesites el dinero (una crisis económica, por ejemplo, que también puede coincidir con que pierdas el trabajo) podría estar en un mal momento de mercado.",
              "Depósitos a plazo fijo con penalización por cancelación anticipada, que van en contra del propio propósito de tener el dinero disponible.",
            ],
          },
        ],
      },
    ],
    faqEntries: [
      {
        question: "¿El fondo de emergencia debería estar invertido para no perder valor frente a la inflación?",
        answer:
          "Es una tensión real: mantenerlo sin invertir significa que pierde poder adquisitivo con el tiempo, pero invertirlo introduce el riesgo de que esté en mal momento justo cuando lo necesites. El consenso habitual es priorizar la disponibilidad y aceptar esa pequeña pérdida de poder adquisitivo como el «coste» de tener seguridad.",
      },
      {
        question: "¿Cuenta el saldo de mi nómina como parte del fondo de emergencia?",
        answer:
          "No se suele recomendar contarlo como tal, ya que ese dinero normalmente está destinado a gastos del mes en curso. El fondo de emergencia debería ser dinero aparte, con el propósito específico de cubrir imprevistos.",
      },
      {
        question: "¿Debería tener el fondo de emergencia antes de empezar a invertir?",
        answer:
          "Es el orden que recomienda la mayoría de asesores financieros: primero el fondo de emergencia, después objetivos de inversión a largo plazo. Invertir sin fondo de emergencia te puede obligar a vender inversiones en mal momento si surge un imprevisto.",
      },
      {
        question: "¿Puedo usar mi fondo de emergencia para una oportunidad de inversión?",
        answer:
          "No es lo recomendable. El fondo de emergencia tiene un propósito específico (cubrir imprevistos), y usarlo para otra cosa, aunque sea una buena oportunidad, te deja sin esa protección justo cuando la necesites.",
      },
      {
        question: "¿Cómo calculo cuánto necesito ahorrar cada mes para construir mi fondo de emergencia?",
        answer:
          "Puedes calcularlo con nuestra [calculadora de objetivo de ahorro](/calculadoras/objetivo-ahorro), indicando la cantidad objetivo, el plazo que quieres darte, y la rentabilidad de tu cuenta remunerada (o 0% si prefieres no considerar ningún rendimiento).",
      },
    ],
    relatedGlossarySlugs: ["liquidez"],
    disclaimer:
      "Este artículo tiene fines educativos y no constituye asesoramiento financiero personalizado. Las referencias sobre el tamaño del fondo de emergencia son orientativas y no están ajustadas a tu situación concreta (estabilidad laboral, cargas familiares, otros ingresos). Antes de tomar decisiones financieras importantes, valora tu caso particular o consulta con un profesional cualificado.",
  },
  {
    slug: "fondos-indexados-vs-gestion-activa",
    category: "articulo",
    title: "Fondos indexados vs. gestión activa: la comisión importa más de lo que crees",
    description:
      "Por qué la mayoría de fondos de gestión activa no baten a su índice, y cuánto te cuesta realmente una comisión más alta a largo plazo.",
    publishedDate: "17 de julio de 2026",
    lastUpdated: "julio de 2026",
    sections: [
      {
        heading: "Introducción",
        blocks: [
          {
            type: "paragraph",
            text: "Cuando eliges un fondo de inversión, es fácil fijarse solo en la rentabilidad pasada y pasar por alto la comisión que vas a pagar cada año. Pero la comisión no es un detalle menor: es de los pocos factores de la inversión que puedes controlar con certeza desde el primer día, mientras que la rentabilidad futura es siempre incierta.",
          },
        ],
      },
      {
        heading: "Gestión activa vs. gestión pasiva (indexada)",
        blocks: [
          {
            type: "paragraph",
            text: "Un fondo de gestión activa tiene un equipo de gestores que decide qué comprar y vender, intentando batir a un índice de referencia. Un [fondo indexado](/glosario/fondo-indexado) (gestión pasiva) simplemente replica ese índice de forma automática, sin intentar seleccionar mejor que el mercado.",
          },
          {
            type: "paragraph",
            text: "La gestión activa suele cobrar una [comisión de gestión](/glosario/comision-de-gestion) más alta, porque incluye el coste de ese equipo de análisis y toma de decisiones. La gestión pasiva cobra mucho menos, porque el proceso es automático.",
          },
        ],
      },
      {
        heading: "Lo que dicen los datos: ¿merece la pena pagar más por gestión activa?",
        blocks: [
          {
            type: "paragraph",
            text: "Según el informe SPIVA Europe Scorecard (S&P Dow Jones Indices), que compara sistemáticamente el rendimiento de fondos de gestión activa contra sus índices de referencia, más del 90% de los fondos de renta variable europeos de gestión activa no consiguen batir a su índice en un horizonte de 10 años. El patrón se repite, con variaciones según el año y la categoría, en prácticamente todos los mercados analizados, incluido el español.",
          },
          {
            type: "paragraph",
            text: "Esto no significa que sea imposible encontrar un fondo activo que bata al mercado —algunos lo consiguen, especialmente en periodos cortos— pero sí significa que es la excepción, no la norma, y que identificar de antemano cuál va a ser esa excepción es extremadamente difícil incluso para inversores experimentados.",
          },
        ],
      },
      {
        heading: "Cuánto cuesta realmente una comisión más alta",
        blocks: [
          {
            type: "paragraph",
            text: "Imagina que inviertes 10.000 € durante 25 años, con una rentabilidad bruta esperada del 7% anual antes de comisiones, y comparas tres escenarios de comisión: 0,2% (típico de un fondo indexado), 1% (una comisión de gestión activa moderada) y 2% (una comisión de gestión activa alta). Con estos datos, calculados con nuestra [calculadora de coste de comisiones](/calculadoras/coste-comisiones), el capital final en cada escenario es el siguiente:",
          },
          {
            type: "table",
            caption: "Capital final a los 25 años de invertir 10.000 € al 7% bruto anual, según la comisión aplicada",
            headers: ["Escenario", "Comisión anual", "Capital final a 25 años"],
            rows: [
              ["Comisión baja (indexado)", "0,2%", "54.477,43 €"],
              ["Comisión media", "1%", "44.649,70 €"],
              ["Comisión alta (activa)", "2%", "34.812,90 €"],
            ],
          },
          {
            type: "paragraph",
            text: "La diferencia entre el escenario de comisión baja y el de comisión alta es de 19.664,53 € — solo por el efecto acumulado de una comisión 1,8 puntos porcentuales más alta cada año, aplicada sobre el mismo capital inicial y la misma rentabilidad bruta. Esta es la razón por la que la comisión importa incluso si un fondo activo consiguiera igualar —no superar— la rentabilidad bruta del índice: partiendo del mismo punto, una comisión más alta te deja sistemáticamente con menos dinero al final.",
          },
        ],
      },
      {
        heading: "La ventaja fiscal adicional de los fondos en España",
        blocks: [
          {
            type: "paragraph",
            text: "Además de las comisiones más bajas, los fondos indexados en España tienen una ventaja fiscal que los [ETF](/glosario/etf) no ofrecen: el [traspaso entre fondos sin tributar](/glosario/traspaso-de-fondos), que te permite cambiar de fondo o reequilibrar tu cartera sin generar una factura fiscal inmediata. Puedes leer el detalle completo en nuestra [guía de tributación del ahorro e inversión en España](/guias/tributacion-ahorro-inversion-espana).",
          },
        ],
      },
    ],
    faqEntries: [
      {
        question: "¿Los fondos indexados garantizan mejor rentabilidad que los activos?",
        answer:
          "No garantizan nada — simplemente replican el índice, así que su rentabilidad será la del mercado menos su (baja) comisión. Lo que muestran los datos es que, en conjunto y a largo plazo, esa opción suele superar a la mayoría de los fondos activos, no que sea matemáticamente imposible que un fondo activo lo haga mejor en un caso concreto.",
      },
      {
        question: "¿Por qué existen entonces los fondos de gestión activa si la mayoría no bate al índice?",
        answer:
          "Hay demanda de inversores que creen (con razón en algunos casos concretos, pero no en la mayoría) que pueden identificar de antemano qué gestor va a superar al mercado, y las gestoras obtienen mayores ingresos por comisión con productos de gestión activa que con productos indexados.",
      },
      {
        question: "¿Toda la gestión activa es mala inversión?",
        answer:
          "No es una afirmación tan categórica. Existen fondos activos que baten consistentemente a su índice durante largos periodos, y algunos inversores valoran otros aspectos de la gestión activa, como estrategias específicas no replicables por un índice. Pero estadísticamente, la probabilidad de acertar con uno de esos fondos de antemano es baja.",
      },
      {
        question: "¿Una comisión del 1% es alta o baja?",
        answer:
          "Depende de la categoría: para un fondo indexado global, un 1% se considera relativamente alto (lo habitual ronda el 0,1%-0,3%). Para un fondo de gestión activa, un 1% está dentro de lo común, aunque existen opciones más baratas y más caras.",
      },
      {
        question: "¿Cómo comparo el impacto de la comisión en mi caso concreto?",
        answer:
          "Puedes usar nuestra [calculadora de coste de comisiones](/calculadoras/coste-comisiones), indicando tu capital, horizonte temporal, y los distintos escenarios de comisión que quieras comparar.",
      },
    ],
    relatedGlossarySlugs: ["fondo-indexado", "comision-de-gestion", "etf", "traspaso-de-fondos"],
    disclaimer:
      "Este artículo tiene fines educativos y no constituye asesoramiento financiero personalizado ni recomendación de ningún fondo o producto concreto. Los datos de SPIVA citados son agregados históricos y no garantizan el comportamiento futuro de ningún fondo, activo o indexado. Antes de tomar decisiones de inversión, valora tu caso particular o consulta con un profesional cualificado.",
  },
  {
    slug: "coste-de-empezar-tarde-a-invertir",
    category: "articulo",
    title: "¿Qué pasa si empiezas a invertir 10 años tarde? El coste real de esperar",
    description:
      "Cuánto te cuesta en euros reales retrasar 10 años el inicio de tu inversión, con ejemplos calculados con nuestra calculadora de interés compuesto.",
    publishedDate: "17 de julio de 2026",
    lastUpdated: "julio de 2026",
    sections: [
      {
        heading: "Introducción",
        blocks: [
          {
            type: "paragraph",
            text: "«Ya invertiré cuando gane más» o «ya invertiré cuando tenga más ahorrado» son dos de las frases que más veces retrasan el momento de empezar a invertir. El problema es que ese retraso tiene un coste real, medible en euros, y ese coste no es lineal: cada año que se espera no solo se pierde ese año de aportaciones, se pierde también el tiempo que esas aportaciones habrían tenido para crecer con el interés compuesto.",
          },
        ],
      },
      {
        heading: "Por qué el tiempo pesa más que la cantidad",
        blocks: [
          {
            type: "paragraph",
            text: "El [interés compuesto](/glosario/interes-compuesto) necesita tiempo para desplegar todo su efecto. En los primeros años, el crecimiento de una inversión es lento y poco visible — la mayor parte del capital final de una inversión a muy largo plazo no se genera en los primeros años, sino en los últimos, cuando el capital acumulado ya es grande y cada punto porcentual de rentabilidad se aplica sobre una base mucho mayor. Por eso, empezar antes, aunque sea con poco dinero, suele pesar más que empezar más tarde con más dinero.",
          },
        ],
      },
      {
        heading: "Comparación con euros reales",
        blocks: [
          {
            type: "paragraph",
            text: "Compara a dos personas que aportan exactamente 150 €/mes a una rentabilidad esperada del 7% anual, sin capital inicial, hasta los 65 años. La Persona A empieza a los 25 años (40 años de aportaciones); la Persona B empieza a los 35 años, diez años más tarde (30 años de aportaciones). Con estos datos, calculados con la misma fórmula que usa nuestra [calculadora de interés compuesto](/calculadoras/interes-compuesto), el resultado a los 65 años es el siguiente:",
          },
          {
            type: "table",
            caption: "Capital final a los 65 años aportando 150 €/mes al 7% anual, según la edad de inicio",
            headers: ["", "Persona A (empieza a los 25)", "Persona B (empieza a los 35)"],
            rows: [
              ["Años aportando", "40", "30"],
              ["Total aportado de su bolsillo", "72.000 €", "54.000 €"],
              ["Capital final a los 65 años", "393.722,01 €", "182.995,65 €"],
            ],
          },
          {
            type: "paragraph",
            text: "La diferencia en el capital final es de 210.726,36 € a favor de la Persona A. Pero fíjate en la fila de aportaciones: la Persona A solo puso 18.000 € más de su bolsillo que la Persona B (10 años × 150 €/mes) — el resto de esa diferencia de más de 210.000 € no viene de aportar más dinero, viene únicamente de haber tenido 10 años más para que el interés compuesto actuara.",
          },
        ],
      },
      {
        heading: "Un segundo escenario: ¿cuánto tendría que aportar la Persona B para igualar a la Persona A?",
        blocks: [
          {
            type: "paragraph",
            text: "Si la Persona B quisiera llegar a esos mismos 393.722,01 € a los 65 años, partiendo también de 0 € pero con solo 30 años por delante en vez de 40, necesitaría aportar unos 322,73 €/mes — más del doble de los 150 €/mes de la Persona A, solo para compensar esos 10 años de diferencia.",
          },
        ],
      },
      {
        heading: "El coste de esperar «solo un poco más»",
        blocks: [
          {
            type: "paragraph",
            text: "Este ejercicio no es un argumento para invertir cualquier cantidad de forma precipitada, ni para sentir que «ya es tarde» si no empezaste a los 25 años — nunca es tarde para empezar, el mejor momento después de «hace 10 años» es «ahora». El objetivo es mostrar, con números reales, que la variable que más se puede optimizar en una inversión a largo plazo no es encontrar la inversión perfecta o el momento perfecto de mercado, sino simplemente reducir el tiempo que el dinero pasa fuera de la inversión.",
          },
        ],
      },
    ],
    faqEntries: [
      {
        question: "¿Esto significa que no debería esperar nunca antes de invertir?",
        answer:
          "No es un consejo para invertir sin fondo de emergencia o con dinero que podrías necesitar a corto plazo. Es un argumento sobre priorizar el tiempo una vez que ya tienes cubiertas esas bases, no sobre saltarte pasos previos importantes.",
      },
      {
        question: "¿Es mejor empezar con poco dinero ya, o esperar a tener más para empezar con una cantidad mayor?",
        answer:
          "Salvo que tengas una razón de peso para esperar (por ejemplo, terminar de construir tu fondo de emergencia), empezar antes con menos suele pesar más que esperar para empezar con más, precisamente por el efecto del tiempo sobre el interés compuesto.",
      },
      {
        question: "¿Este cálculo tiene en cuenta la inflación?",
        answer:
          "No, el ejemplo usa una rentabilidad nominal constante del 7%, sin descontar inflación, para simplificar la comparación entre ambos escenarios. Si quieres ver el efecto de la inflación sobre tu poder adquisitivo futuro, puedes usar nuestra [calculadora de inflación y poder adquisitivo](/calculadoras/inflacion-poder-adquisitivo).",
      },
      {
        question: "¿Puedo compensar el tiempo perdido aportando más dinero cada mes?",
        answer:
          "Sí, es posible compensarlo parcialmente aumentando la aportación mensual, aunque como muestra el ejemplo, suele hacer falta un incremento proporcionalmente mayor que los años perdidos para llegar al mismo resultado final.",
      },
      {
        question: "¿Cómo calculo mi propio caso con mi edad y aportación real?",
        answer:
          "Puedes usar nuestra [calculadora de interés compuesto](/calculadoras/interes-compuesto), introduciendo tu capital inicial, tu aportación mensual y los años que te quedan hasta tu horizonte de inversión.",
      },
    ],
    relatedGlossarySlugs: ["interes-compuesto"],
    disclaimer:
      "Este artículo tiene fines educativos y no constituye asesoramiento financiero personalizado. Los ejemplos usan una rentabilidad nominal constante del 7% con fines ilustrativos; las rentabilidades reales de mercado varían de un año a otro y no están garantizadas. Antes de tomar decisiones de inversión, valora tu caso particular o consulta con un profesional cualificado.",
  },
  {
    slug: "coste-real-comisiones-fondos-espana",
    category: "estudio",
    title: "El coste real de las comisiones de los fondos en España: estudio propio",
    description:
      "Simulación propia: pagar una comisión del 2% en vez del 0,2% le cuesta a un inversor español casi 100.000€ en 40 años — más de lo que ha aportado en toda su vida.",
    publishedDate: "18 de julio de 2026",
    lastUpdated: "julio de 2026",
    headlineStat: {
      label: "Coste de pagar una comisión alta (2%) en vez de una baja (0,2%) durante 40 años",
      value: "98.086 €",
      caption:
        "Simulación propia de Invexia: aportación de 200€/mes, sin capital inicial, rentabilidad bruta del 7% anual, desde los 25 hasta los 65 años",
    },
    sections: [
      {
        heading: "El dato en una frase",
        blocks: [
          {
            type: "paragraph",
            text: "Un inversor que aporta 200 € al mes durante 40 años (desde los 25 hasta los 65 años), con una rentabilidad bruta del 7% anual, pierde 98.086 € solo por pagar una comisión anual del 2% en vez de una del 0,2%. Esa cifra es mayor que el total de dinero que esa persona ha aportado de su bolsillo a lo largo de toda su vida (96.000 €): la comisión, acumulada durante cuatro décadas, le cuesta más que todos sus propios ahorros juntos.",
          },
        ],
      },
      {
        heading: "Por qué esto importa",
        blocks: [
          {
            type: "paragraph",
            text: "Una diferencia de 1,8 puntos porcentuales en la comisión anual (2% frente a 0,2%) suena a poco cuando se ve como un número aislado en la ficha de un fondo. Pero esa comisión no se paga una sola vez: se descuenta cada año, sobre un capital cada vez mayor, durante todo el tiempo que el dinero está invertido. Es el mismo mecanismo del interés compuesto que hace crecer una inversión, funcionando esta vez en sentido contrario.",
          },
        ],
      },
      {
        heading: "Los números completos, por horizonte temporal",
        blocks: [
          {
            type: "paragraph",
            text: "Estos son los resultados completos para los cuatro horizontes analizados, calculados con la misma [calculadora de interés compuesto](/calculadoras/interes-compuesto) que puedes usar para tu propio caso:",
          },
          {
            type: "table",
            caption:
              "Capital final aportando 200 €/mes al 7% bruto anual, comparando una comisión del 0,2% frente a una del 2%, según el horizonte temporal",
            headers: ["Horizonte", "Capital final (comisión 0,2%)", "Capital final (comisión 2%)", "Diferencia"],
            rows: [
              ["10 años", "34.238,56 €", "32.775,87 €", "1.462,70 €"],
              ["20 años", "101.691,71 €", "92.408,18 €", "9.283,53 €"],
              ["30 años", "234.580,66 €", "200.903,01 €", "33.677,65 €"],
              ["40 años", "496.384,20 €", "398.298,15 €", "98.086,05 €"],
            ],
          },
        ],
      },
      {
        heading: "Metodología",
        blocks: [
          {
            type: "paragraph",
            text: "Este estudio usa una simulación propia, calculada con el mismo motor de cálculo que usa la [calculadora de interés compuesto](/calculadoras/interes-compuesto) de Invexia, aplicando la fórmula estándar de interés compuesto con aportaciones mensuales.",
          },
          {
            type: "paragraph",
            text: "Supuestos del escenario base:",
          },
          {
            type: "list",
            items: [
              "Aportación mensual: 200€ (cifra ilustrativa y redonda, no un promedio oficial de ningún organismo — se eligió por ser una cantidad realista y fácil de escalar mentalmente para cualquier lector)",
              "Capital inicial: 0€",
              "Rentabilidad bruta anual: 7% (rentabilidad histórica aproximada de un fondo indexado global a largo plazo, antes de comisiones)",
              "Comisión «baja»: 0,2% (típica de un fondo indexado de bajo coste)",
              "Comisión «alta»: 2% (frecuente en fondos con comisiones elevadas)",
              "Ambos escenarios parten de los mismos supuestos de aportación, capital y rentabilidad bruta; la única variable que cambia es la comisión anual",
            ],
          },
          {
            type: "paragraph",
            text: "Limitaciones: esta es una simulación con una rentabilidad constante, no una predicción de mercado real (los mercados no rinden un porcentaje fijo cada año). El objetivo del estudio es ilustrar el efecto compuesto del coste de una comisión, no predecir el resultado real de ninguna inversión concreta.",
          },
          {
            type: "paragraph",
            text: "El código completo de esta simulación es público y verificable en el [repositorio de GitHub](https://github.com/pacomarquezar-dev/invexia) de Invexia.",
          },
        ],
      },
    ],
    faqEntries: [
      {
        question: "¿Este dato es un promedio real de lo que pagan los españoles?",
        answer:
          "No. Es una simulación con supuestos razonables e ilustrativos (200€/mes, 40 años, 7% bruto), no un promedio estadístico oficial de ningún organismo. El objetivo es mostrar el efecto matemático de la diferencia de comisión, aplicable a cualquier persona ajustando sus propios números.",
      },
      {
        question: "¿Por qué comparar 0,2% con 2% y no con otras cifras?",
        answer:
          "Son cifras representativas de los extremos habituales del mercado: 0,2% es típico de fondos indexados de bajo coste, y 2% es una comisión frecuente en fondos de gestión activa con comisiones elevadas. Puedes calcular tu propio caso con nuestra [calculadora de coste de comisiones](/calculadoras/coste-comisiones).",
      },
      {
        question: "¿Estas comisiones tan altas existen de verdad en el mercado español?",
        answer:
          "Sí, comisiones de gestión del entorno del 1,5%-2% son habituales en muchos fondos de gestión activa comercializados en España, especialmente los distribuidos por redes de banca tradicional.",
      },
      {
        question: "¿Puedo replicar este cálculo con mis propios números?",
        answer:
          "Sí, puedes hacerlo con nuestra [calculadora de interés compuesto](/calculadoras/interes-compuesto), ejecutándola dos veces con tu capital y aportación reales, una vez con cada tasa de rentabilidad neta (rentabilidad bruta menos cada comisión).",
      },
      {
        question: "¿Puedo usar estos datos citando la fuente?",
        answer:
          "Sí, este estudio es de libre consulta y cita, siempre que se atribuya a Invexia (invexia.app) como fuente.",
      },
    ],
    relatedGlossarySlugs: ["comision-de-gestion", "interes-compuesto", "fondo-indexado"],
    disclaimer:
      "Este estudio tiene fines educativos e ilustrativos y no constituye asesoramiento financiero personalizado ni una predicción de mercado. Los resultados son una simulación con una rentabilidad constante hipotética; los mercados reales no rinden un porcentaje fijo cada año, y las comisiones concretas varían según el fondo y la entidad. Antes de tomar decisiones de inversión, valora tu caso particular o consulta con un profesional cualificado.",
  },
];
