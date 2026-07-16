export interface GlossaryRelatedCalculator {
  href: string;
  label: string;
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  /** Una frase, para la tarjeta del listado. */
  shortDefinition: string;
  /** Definición educativa de 150-300 palabras. */
  definition: string;
  /** Ejemplo numérico sencillo. */
  example: string;
  relatedCalculator?: GlossaryRelatedCalculator;
}

/**
 * Fuente única de verdad para el glosario: /glosario y /glosario/[termino]
 * leen de aquí, igual que /calculadoras lee de lib/calculators.ts.
 */
export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "tae",
    term: "TAE (Tasa Anual Equivalente)",
    shortDefinition:
      "El indicador que resume, en un único porcentaje anual, el coste o rendimiento real de un producto financiero.",
    definition:
      "La TAE (Tasa Anual Equivalente) es el indicador que resume, en un único porcentaje anual, el coste o la rentabilidad real de un producto financiero: un préstamo, una hipoteca, un depósito o una cuenta remunerada. A diferencia del TIN (tipo de interés nominal), que solo refleja el interés \"de etiqueta\" del producto, la TAE incorpora también la frecuencia con la que se aplican los pagos o intereses (mensual, trimestral, anual...) y las comisiones y gastos asociados a la operación. Por eso la TAE suele ser distinta —normalmente más alta en un préstamo, o más baja en un depósito— que el TIN del mismo producto. Su gran utilidad es precisamente esa: al ser un cálculo normalizado (regulado en España por el Banco de España), permite comparar de forma justa dos productos que a simple vista parecen distintos, por ejemplo un préstamo con TIN bajo pero comisiones altas frente a otro con TIN algo mayor pero sin comisiones. Cuando la TAE incorpora capitalización con una frecuencia distinta a la anual, el resultado refleja el efecto del interés compuesto: cobrar o pagar intereses varias veces al año hace que el coste o rendimiento efectivo se aleje del tipo nominal. Por ley, las entidades financieras en España están obligadas a mostrar la TAE en la publicidad y en los contratos de préstamos, hipotecas y depósitos, precisamente para proteger al consumidor y facilitar la comparación entre ofertas.",
    example:
      "Un depósito con un TIN del 5% anual pagado mensualmente (es decir, capitalizando cada mes) tiene una TAE del 5,116%, algo superior al TIN, porque cada mes generas intereses sobre los intereses ya cobrados. Si además el banco cobrara una comisión de mantenimiento, la TAE bajaría, reflejando el coste real para el ahorrador.",
    relatedCalculator: { href: "/calculadoras/interes-compuesto", label: "Calculadora de interés compuesto" },
  },
  {
    slug: "tin",
    term: "TIN (Tipo de Interés Nominal)",
    shortDefinition:
      "El tipo de interés \"de etiqueta\" de un producto financiero, sin comisiones ni el efecto de la frecuencia de capitalización.",
    definition:
      "El TIN (Tipo de Interés Nominal) es el porcentaje de interés que una entidad financiera aplica a una operación —un préstamo, una hipoteca o un depósito— sin tener en cuenta ni las comisiones ni los gastos asociados, ni el efecto de la frecuencia con la que se capitalizan los intereses. Es, en cierto modo, el precio \"de etiqueta\" del dinero: lo que el banco cobra por prestarte, o lo que te paga por depositar tus ahorros, expresado como un porcentaje anual simple. El TIN es un dato necesario para calcular la TAE (Tasa Anual Equivalente), que sí incorpora comisiones, gastos y el efecto de la capitalización, y que por eso ofrece una imagen más completa y comparable del coste o rendimiento real de un producto. Es habitual que el TIN de un préstamo sea inferior a su TAE, porque a esta última se le suman las comisiones de apertura, estudio o mantenimiento. Del mismo modo, en un depósito con pagos de intereses más frecuentes que anuales, la TAE resultante es ligeramente superior al TIN, ya que cada pago de intereses empieza a generar, a su vez, nuevos intereses. Por este motivo, fijarse solo en el TIN de un producto puede llevar a conclusiones erróneas: dos préstamos con el mismo TIN pueden tener un coste real muy distinto si uno de ellos incluye comisiones elevadas. La normativa española obliga a publicitar siempre ambos datos, TIN y TAE, juntos en la información precontractual.",
    example:
      "Un préstamo personal anuncia un TIN del 6%. Si además cobra una comisión de apertura del 1% sobre el capital prestado, la TAE resultante será superior al 6% —por ejemplo, un 6,8%—, porque esa comisión se reparte como coste adicional a lo largo de la vida del préstamo.",
    relatedCalculator: { href: "/calculadoras/interes-compuesto", label: "Calculadora de interés compuesto" },
  },
  {
    slug: "interes-compuesto",
    term: "Interés compuesto",
    shortDefinition:
      "El interés que se genera no solo sobre el capital inicial, sino también sobre los intereses ya acumulados.",
    definition:
      "El interés compuesto es el mecanismo por el cual los intereses que genera una inversión o un depósito se suman al capital y, a partir de ese momento, generan a su vez nuevos intereses. A diferencia del interés simple, donde los intereses se calculan siempre sobre el capital inicial, en el interés compuesto la base de cálculo crece en cada periodo, lo que produce un efecto de crecimiento acelerado —a menudo descrito como \"el interés que se paga sobre el interés\". Este efecto es especialmente relevante en horizontes temporales largos: cuanto más tiempo se mantiene invertido el capital, mayor es la proporción del resultado final que proviene de los intereses generados por intereses anteriores, y no del capital aportado originalmente. Es, por eso, uno de los conceptos más importantes en la planificación financiera a largo plazo, tanto para el ahorro (cuanto antes se empiece a invertir, más tiempo tiene el interés compuesto para actuar) como para las deudas (un préstamo con intereses compuestos e impagos puede crecer muy rápido). La fórmula básica es: capital final = capital inicial × (1 + tipo de interés)^número de periodos. Cuando además se realizan aportaciones periódicas, cada una de ellas empieza a generar sus propios intereses compuestos desde el momento en que se invierte, lo que refuerza aún más el efecto con el paso del tiempo.",
    example:
      "1.000€ invertidos al 7% anual durante 20 años, sin aportaciones adicionales, se convierten en unos 4.038€ gracias al interés compuesto. Con interés simple (siempre el 7% sobre los mismos 1.000€ iniciales cada año, sin reinvertir), el resultado sería de solo 2.400€: casi 1.600€ menos.",
    relatedCalculator: { href: "/calculadoras/interes-compuesto", label: "Calculadora de interés compuesto" },
  },
  {
    slug: "interes-simple",
    term: "Interés simple",
    shortDefinition:
      "El interés que se calcula siempre sobre el capital inicial, sin reinvertir los intereses ya generados.",
    definition:
      "El interés simple es la forma más básica de calcular el rendimiento (o el coste) de una cantidad de dinero a lo largo del tiempo: en cada periodo, el interés se calcula únicamente sobre el capital inicial, sin tener en cuenta los intereses que ya se hayan generado en periodos anteriores. Esto significa que, a diferencia del interés compuesto, la cantidad de interés generada es la misma en cada periodo —no crece con el tiempo— porque siempre se calcula sobre la misma base. La fórmula es: interés total = capital inicial × tipo de interés × número de periodos. El interés simple se usa poco en productos de inversión a largo plazo, donde casi siempre se aplica interés compuesto (el rendimiento se reinvierte), pero sigue siendo habitual en algunos préstamos a corto plazo, letras del tesoro o cálculos rápidos y aproximados. Es importante no confundir ambos conceptos al comparar productos financieros: un mismo tipo de interés nominal aplicado de forma simple o de forma compuesta puede dar resultados muy distintos, especialmente si el horizonte temporal es largo o si hay aportaciones periódicas de por medio. Como regla general, cuanto mayor es el número de periodos, mayor es la diferencia entre el resultado con interés simple y con interés compuesto, ya que este último se beneficia del efecto acumulativo de reinvertir los intereses generados.",
    example:
      "1.000€ al 5% de interés simple anual durante 10 años generan 500€ de intereses (50€ cada año, siempre sobre los mismos 1.000€), por lo que el capital final es de 1.500€. Con interés compuesto al mismo 5%, el capital final sería de unos 1.647€.",
    relatedCalculator: { href: "/calculadoras/interes-compuesto", label: "Calculadora de interés compuesto" },
  },
  {
    slug: "diversificacion",
    term: "Diversificación",
    shortDefinition:
      "Repartir las inversiones entre distintos activos, sectores o zonas geográficas para reducir el riesgo.",
    definition:
      "La diversificación es la estrategia de repartir el dinero invertido entre distintos activos —acciones, bonos, sectores, zonas geográficas, divisas— en lugar de concentrarlo todo en uno solo. La idea central es que distintos activos no suelen moverse exactamente igual: cuando uno cae, otro puede mantenerse estable o incluso subir, lo que suaviza el resultado conjunto de la cartera. Diversificar no elimina el riesgo por completo (existe un riesgo \"sistémico\" o de mercado que afecta a casi todos los activos a la vez, por ejemplo en una crisis financiera global), pero sí reduce de forma significativa el llamado riesgo \"específico\" o \"no sistemático\": el que depende de una empresa, sector o país concretos. Por ejemplo, invertir todo el dinero en las acciones de una sola empresa expone al inversor a que un problema propio de esa empresa (una mala gestión, un escándalo, la pérdida de un mercado clave) arruine toda la inversión; repartir esa misma cantidad entre cientos de empresas distintas reduce enormemente ese riesgo concreto, aunque el inversor siga expuesto a que el mercado en su conjunto baje. Los fondos indexados y los ETF son dos de las herramientas más habituales para diversificar de forma sencilla y con poco capital, ya que replican índices compuestos por decenas o cientos de empresas en una sola operación de compra.",
    example:
      "Invertir 10.000€ solo en acciones de una empresa significa que, si esa empresa cae un 50%, se pierden 5.000€. Invertir esos mismos 10.000€ repartidos a partes iguales entre 100 empresas distintas de un índice significa que, aunque varias de ellas caigan un 50%, el efecto sobre el conjunto de la cartera es mucho menor si el resto se mantiene estable o sube.",
  },
  {
    slug: "volatilidad",
    term: "Volatilidad",
    shortDefinition:
      "La magnitud de las variaciones (subidas y bajadas) que sufre el precio de un activo en un periodo de tiempo.",
    definition:
      "La volatilidad mide cuánto varía el precio de un activo (una acción, un fondo, un índice) en un periodo de tiempo determinado, independientemente de si esas variaciones son al alza o a la baja. Un activo muy volátil experimenta subidas y bajadas de precio grandes y frecuentes; un activo poco volátil se mueve de forma más suave y predecible. Estadísticamente, la volatilidad se suele calcular como la desviación típica de la rentabilidad de un activo en un periodo dado, y se expresa habitualmente en términos anualizados y en porcentaje. La volatilidad es una de las medidas de riesgo más utilizadas en finanzas, aunque conviene matizar que no es exactamente lo mismo que \"riesgo de perder dinero\": un activo puede ser volátil y aun así tener una tendencia de fondo positiva a largo plazo. En general, los activos de renta variable (acciones) son más volátiles que los de renta fija (bonos), y dentro de la renta variable, sectores como la tecnología o las empresas pequeñas suelen ser más volátiles que sectores más estables como el de bienes de consumo básico. Para un inversor con un horizonte temporal largo, la volatilidad a corto plazo importa menos, porque el activo tiene tiempo de recuperarse de las caídas; para alguien que necesita el dinero pronto, la volatilidad es un riesgo mucho más relevante a tener en cuenta.",
    example:
      "Dos fondos tienen la misma rentabilidad media anual del 7%, pero el Fondo A sube y baja entre el -15% y el +25% cada año, mientras que el Fondo B se mueve siempre entre el +4% y el +10%. El Fondo A es mucho más volátil que el Fondo B, aunque a largo plazo ambos podrían dar un resultado similar.",
    relatedCalculator: { href: "/perfil-inversor", label: "Test de perfil de inversor" },
  },
  {
    slug: "etf",
    term: "ETF (fondo cotizado)",
    shortDefinition:
      "Un fondo de inversión que cotiza en bolsa como si fuera una acción y que suele replicar un índice.",
    definition:
      "Un ETF (Exchange-Traded Fund, o \"fondo cotizado\" en español) es un tipo de fondo de inversión que, a diferencia de los fondos tradicionales, cotiza en una bolsa de valores igual que lo haría una acción: se puede comprar y vender en cualquier momento durante el horario de mercado, a un precio que varía en tiempo real. La mayoría de los ETF son \"de gestión pasiva\": en lugar de que un gestor elija activamente en qué empresas invertir, el ETF simplemente replica la composición de un índice de referencia (por ejemplo, el S&P 500 o el Ibex 35), comprando, en la proporción adecuada, todos los activos que lo componen. Esto permite a un inversor, con una sola operación de compra, obtener exposición diversificada a cientos o miles de empresas distintas. Al ser de gestión pasiva, los ETF suelen tener comisiones de gestión mucho más bajas que los fondos de gestión activa, en los que un equipo gestor cobra por intentar batir al mercado seleccionando activos. Los ETF son una de las herramientas más utilizadas en estrategias de inversión a largo plazo y de bajo coste, especialmente combinadas con aportaciones periódicas (DCA). Conviene diferenciar un ETF de un fondo indexado tradicional: ambos suelen replicar un índice, pero el ETF cotiza en bolsa en tiempo real mientras que el fondo indexado clásico solo se compra o vende una vez al día, a un precio de cierre.",
    example:
      "Un ETF que replica el índice S&P 500 permite, con una única compra de por ejemplo 500€, tener una pequeña participación en las 500 mayores empresas cotizadas de Estados Unidos, en lugar de tener que comprar acciones de cada una de ellas por separado.",
  },
  {
    slug: "fondo-indexado",
    term: "Fondo indexado",
    shortDefinition:
      "Un fondo de inversión de gestión pasiva que replica un índice bursátil, comprado y vendido una vez al día.",
    definition:
      "Un fondo indexado es un fondo de inversión de gestión pasiva cuyo objetivo no es batir al mercado, sino replicar lo más fielmente posible el comportamiento de un índice de referencia, como el S&P 500, el MSCI World o el Ibex 35. Para conseguirlo, el fondo compra los mismos activos que componen el índice, en proporciones similares, y los mantiene sin apenas movimientos, salvo cuando el propio índice cambia su composición. Al no requerir un equipo de analistas tomando decisiones activas de compra y venta, los fondos indexados tienen unas comisiones de gestión mucho más bajas que los fondos de gestión activa —a menudo diez o veinte veces menores—, lo cual es especialmente relevante a largo plazo, ya que las comisiones erosionan la rentabilidad de forma acumulativa a través del interés compuesto. Numerosos estudios han mostrado que, en periodos largos, la mayoría de los fondos de gestión activa no consiguen batir de forma consistente a su índice de referencia una vez descontadas las comisiones, lo que ha impulsado la popularidad de los fondos indexados entre inversores particulares. A diferencia de un ETF, que cotiza en bolsa y se puede comprar y vender en cualquier momento del día a precio de mercado, un fondo indexado tradicional solo se puede suscribir o reembolsar una vez al día, a un valor liquidativo calculado al cierre de mercado.",
    example:
      "Un fondo indexado al MSCI World puede tener una comisión de gestión anual del 0,2%, frente al 1,5%-2% habitual de un fondo de gestión activa. Esa diferencia, aparentemente pequeña, puede suponer varios miles de euros menos de capital final tras varias décadas invertido: puedes comprobarlo con un capital y una rentabilidad concretos en la calculadora de coste de comisiones.",
    relatedCalculator: { href: "/calculadoras/coste-comisiones", label: "Calculadora de coste de comisiones" },
  },
  {
    slug: "inflacion",
    term: "Inflación",
    shortDefinition:
      "La subida generalizada y sostenida de los precios, que reduce el poder adquisitivo del dinero con el tiempo.",
    definition:
      "La inflación es el aumento generalizado y sostenido de los precios de los bienes y servicios de una economía durante un periodo de tiempo. Cuando hay inflación, cada euro pierde poder adquisitivo: con la misma cantidad de dinero se puede comprar menos que antes. La inflación se mide habitualmente a través de índices como el IPC (Índice de Precios de Consumo), que sigue la evolución del precio de una cesta representativa de bienes y servicios. Un nivel moderado de inflación se considera normal, e incluso deseable, en una economía en crecimiento; los bancos centrales, como el Banco Central Europeo, suelen fijarse un objetivo de inflación (habitualmente en torno al 2% anual) y usan herramientas como los tipos de interés para intentar mantenerla dentro de ese rango. La inflación tiene un efecto directo y muy relevante sobre el ahorro: el dinero guardado sin generar ningún rendimiento pierde valor real con el paso de los años, aunque la cantidad nominal (el número de euros) no cambie. Por eso, al planificar el ahorro o la inversión a largo plazo, conviene distinguir siempre entre rentabilidad nominal (la cifra bruta que ofrece un producto) y rentabilidad real (esa misma cifra, descontado el efecto de la inflación), que es la que realmente indica si el poder adquisitivo del ahorro crece o disminuye.",
    example:
      "Con una inflación media del 2,5% anual, 10.000€ de hoy tendrían el mismo poder de compra que unos 7.812€ dentro de 10 años: el número de euros no disminuye, pero con esos mismos 10.000€ dentro de 10 años solo se podrán comprar bienes y servicios equivalentes a 7.812€ de hoy.",
    relatedCalculator: { href: "/calculadoras/inflacion-poder-adquisitivo", label: "Calculadora de inflación y poder adquisitivo" },
  },
  {
    slug: "liquidez",
    term: "Liquidez",
    shortDefinition:
      "La facilidad y rapidez con la que un activo puede convertirse en dinero en efectivo sin perder valor.",
    definition:
      "La liquidez es la facilidad, rapidez y coste con el que un activo puede convertirse en dinero en efectivo disponible, sin que ese proceso implique una pérdida significativa de valor. El dinero en efectivo o en una cuenta corriente es, por definición, el activo más líquido: está disponible de forma inmediata. En el otro extremo, activos como un inmueble o una participación en una empresa no cotizada son mucho menos líquidos: venderlos puede llevar semanas o meses, y a veces exige aceptar un precio inferior al valor \"real\" para encontrar comprador rápido. Entre esos dos extremos se sitúan la mayoría de los productos de inversión: las acciones y los ETF cotizados en bolsas de gran volumen suelen ser muy líquidos (se pueden vender en segundos durante el horario de mercado), mientras que ciertos fondos de inversión, planes de pensiones o depósitos a plazo fijo tienen restricciones o penalizaciones por reembolso anticipado que reducen su liquidez. La liquidez es un factor clave a tener en cuenta junto con el horizonte temporal de cada inversión: no tiene sentido inmovilizar en un producto poco líquido el dinero que se pueda necesitar a corto plazo para un imprevisto, por buena que sea su rentabilidad esperada. Por eso muchos planificadores financieros recomiendan mantener un \"fondo de emergencia\" en productos muy líquidos, separado del resto de los ahorros destinados a inversión a más largo plazo.",
    example:
      "Si tienes 5.000€ en una cuenta de ahorro, puedes retirarlos en minutos: es un activo muy líquido. Si esos mismos 5.000€ están invertidos en un plan de pensiones, normalmente no podrás disponer de ellos hasta la jubilación (salvo excepciones legales), por lo que su liquidez es muy baja, aunque el dinero siga siendo tuyo.",
  },
  {
    slug: "perfil-de-riesgo",
    term: "Perfil de riesgo",
    shortDefinition:
      "El nivel de riesgo que un inversor está dispuesto y puede permitirse asumir, según su tolerancia y su situación.",
    definition:
      "El perfil de riesgo (o perfil de inversor) describe el nivel de riesgo que una persona está dispuesta a asumir, y también el que puede permitirse asumir, al invertir su dinero. Se suele hablar de tres grandes categorías —conservador, moderado y agresivo—, aunque en la práctica es un continuo que depende de varios factores combinados: la tolerancia emocional a ver caer el valor de las inversiones sin vender por pánico, el horizonte temporal antes de necesitar el dinero (cuanto más lejano, más riesgo se puede asumir, porque hay más tiempo para recuperarse de las caídas), la experiencia previa invirtiendo, y la situación financiera personal. Un perfil conservador prioriza la seguridad del capital, incluso a costa de una rentabilidad esperada más baja, y suele encajar con horizontes temporales cortos o con personas con poca tolerancia a la volatilidad. Un perfil agresivo tolera bien las caídas fuertes a corto plazo a cambio de buscar una mayor rentabilidad esperada a largo plazo, y suele encajar con horizontes temporales largos. El perfil de riesgo no es una etiqueta fija de por vida: puede, y suele, cambiar con el tiempo, a medida que cambian la edad, el horizonte temporal o la situación personal del inversor. Conocer el propio perfil de riesgo, antes de elegir en qué invertir, ayuda a evitar tomar decisiones basadas en el miedo o en la euforia del momento.",
    example:
      "Ante una caída del 20% en sus inversiones, un perfil conservador tenderá a vender para proteger lo que le queda; un perfil agresivo, con un horizonte temporal largo, probablemente mantendrá la inversión e incluso aprovechará para comprar más, confiando en la recuperación a largo plazo.",
    relatedCalculator: { href: "/perfil-inversor", label: "Test de perfil de inversor" },
  },
  {
    slug: "dca",
    term: "DCA (aportaciones periódicas)",
    shortDefinition:
      "Invertir una cantidad fija de forma periódica (por ejemplo, cada mes), en lugar de invertir todo el capital de golpe.",
    definition:
      "DCA (Dollar-Cost Averaging, o \"promediado de coste\", aunque en la práctica se suele hablar simplemente de \"aportaciones periódicas\") es una estrategia de inversión que consiste en invertir una cantidad fija de dinero de forma regular —por ejemplo, cada mes— en lugar de invertir todo el capital disponible de una sola vez. Al comprar siempre la misma cantidad en euros, cuando el precio del activo está más bajo se compran más participaciones, y cuando está más alto se compran menos, lo que suaviza el precio medio de compra a lo largo del tiempo y reduce el riesgo de invertir todo el capital justo antes de una caída fuerte del mercado. El DCA es especialmente popular entre inversores particulares que ahorran de su nómina mes a mes, ya que encaja de forma natural con ese ritmo de ingresos, y también porque reduce el impacto psicológico de invertir una gran cantidad de golpe justo antes de una posible caída. Desde un punto de vista puramente matemático, y asumiendo que los mercados tienden a subir a largo plazo, invertir todo el capital disponible de golpe (\"pago único\") suele producir, en promedio, un resultado ligeramente mejor que el DCA, precisamente porque el dinero pasa más tiempo invertido y generando interés compuesto. Sin embargo, el DCA sigue siendo muy valorado porque reduce el riesgo de \"mal timing\" y facilita mantener la disciplina de inversión con el tiempo.",
    example:
      "En lugar de invertir 12.000€ de golpe en enero, un inversor que aplica DCA invierte 1.000€ cada mes durante todo el año. Si el mercado cae en los primeros meses, esas aportaciones compran más barato; si sube, compran algo más caro, pero el inversor evita el riesgo de haber invertido todo justo en el peor momento posible.",
    relatedCalculator: { href: "/calculadoras/dca-vs-pago-unico", label: "Calculadora DCA vs pago único" },
  },
  {
    slug: "apalancamiento",
    term: "Apalancamiento",
    shortDefinition:
      "Usar dinero prestado para invertir más capital del que se tiene, multiplicando tanto las ganancias como las pérdidas.",
    definition:
      "El apalancamiento financiero consiste en utilizar dinero prestado (deuda) para invertir una cantidad de capital mayor de la que realmente se posee, con el objetivo de multiplicar la rentabilidad potencial de la inversión. El ejemplo más habitual para un particular es la hipoteca: al comprar una vivienda con una entrada del 20% y un préstamo por el 80% restante, cualquier subida en el valor de la vivienda se calcula sobre el 100% del precio, pero el inversor solo ha puesto el 20% de su propio bolsillo, lo que multiplica (apalanca) su rentabilidad sobre el capital propio invertido. El problema es que el apalancamiento funciona exactamente igual, pero al revés, en el caso de una pérdida: si el valor del activo cae, las pérdidas también se calculan sobre el 100% del capital invertido, pero se concentran sobre el capital propio, mucho menor, lo que puede hacer que un inversor pierda más dinero del que inicialmente puso, o incluso quedar en deuda. En mercados financieros, el apalancamiento se utiliza a través de productos como los CFD, los futuros o el margen de préstamo de un bróker, y es una de las principales causas de pérdidas rápidas y elevadas entre inversores particulares inexpertos. Por su elevado riesgo, el apalancamiento se considera generalmente inadecuado para perfiles conservadores o para quien no entiende completamente cómo funciona el producto.",
    example:
      "Con 1.000€ propios y apalancamiento 5:1, un inversor controla una posición de 5.000€. Si el activo sube un 10%, la ganancia es de 500€ —un 50% sobre el capital propio de 1.000€—. Pero si el activo cae un 10%, la pérdida también es de 500€: la mitad de todo el capital propio invertido, por una caída de solo el 10% en el activo.",
  },
  {
    slug: "comision-de-gestion",
    term: "Comisión de gestión",
    shortDefinition:
      "El coste anual, expresado como porcentaje, que cobra un fondo o producto de inversión por gestionar el dinero.",
    definition:
      "La comisión de gestión es el coste que cobra la entidad gestora de un fondo de inversión, plan de pensiones u otro producto similar por administrar el dinero de los partícipes: seleccionar los activos, hacer el seguimiento, cumplir con las obligaciones legales, etc. Se expresa habitualmente como un porcentaje anual sobre el patrimonio invertido (por ejemplo, un 1,5% anual), y se descuenta de forma continua del valor del fondo, por lo que el inversor no la ve como un cargo aparte, sino como una reducción silenciosa de la rentabilidad. A menudo se agrupa junto con otros gastos del fondo (depositaría, auditoría...) bajo el nombre de TER (Total Expense Ratio, o ratio de gastos totales). Aunque una diferencia de uno o dos puntos porcentuales en la comisión anual puede parecer pequeña, su efecto es enorme a largo plazo debido al interés compuesto: cada euro que se paga en comisiones deja de generar, a su vez, nuevos rendimientos en los años siguientes. Los fondos de gestión activa, en los que un equipo de gestores toma decisiones para intentar batir al mercado, suelen tener comisiones de gestión sensiblemente más altas (entre el 1% y el 2,5% anual) que los fondos indexados o los ETF de gestión pasiva, a menudo por debajo del 0,3% anual.",
    example:
      "10.000€ invertidos durante 30 años al 7% de rentabilidad bruta anual terminan en unos 76.465€ con una comisión del 0,2% anual, pero solo en unos 44.677€ con una comisión del 2% anual: casi 32.000€ menos, debidos únicamente al efecto acumulado de la comisión.",
    relatedCalculator: { href: "/calculadoras/coste-comisiones", label: "Calculadora de coste de comisiones" },
  },
  {
    slug: "rentabilidad-real-vs-nominal",
    term: "Rentabilidad real vs. nominal",
    shortDefinition:
      "La rentabilidad nominal es la cifra bruta que ofrece una inversión; la real descuenta el efecto de la inflación.",
    definition:
      "La rentabilidad nominal es el porcentaje de ganancia (o pérdida) que muestra una inversión sin ajustar por ningún otro factor: es la cifra \"en bruto\" que normalmente se anuncia, por ejemplo \"este fondo ha subido un 8% este año\". La rentabilidad real, en cambio, es esa misma rentabilidad una vez descontado el efecto de la inflación del periodo, y refleja el verdadero aumento (o disminución) del poder adquisitivo del dinero invertido. La relación aproximada entre ambas es: rentabilidad real ≈ rentabilidad nominal − inflación. Esta distinción es fundamental para evaluar si una inversión realmente ha hecho crecer el patrimonio en términos de lo que se puede comprar con él, y no solo en número de euros. Un ejemplo extremo ayuda a entenderlo: un depósito que paga un 1% de interés nominal en un año en el que la inflación ha sido del 4% ha tenido, en realidad, una rentabilidad real negativa de aproximadamente el -3%: aunque el número de euros en la cuenta ha crecido, con ellos se puede comprar menos que hace un año. Por eso, cualquier objetivo de ahorro o inversión a largo plazo debería plantearse siempre pensando en términos reales, y no solo nominales, especialmente en periodos de inflación elevada, donde la diferencia entre ambas cifras puede ser muy significativa.",
    example:
      "Si una inversión genera una rentabilidad nominal del 6% en un año en el que la inflación ha sido del 3%, la rentabilidad real aproximada es del 3%: el poder adquisitivo del capital ha crecido solo la mitad de lo que sugiere la cifra nominal.",
    relatedCalculator: { href: "/calculadoras/inflacion-poder-adquisitivo", label: "Calculadora de inflación y poder adquisitivo" },
  },
  {
    slug: "drawdown",
    term: "Drawdown",
    shortDefinition:
      "La caída porcentual desde el máximo histórico alcanzado por una inversión hasta su punto más bajo posterior.",
    definition:
      "El drawdown es una medida del riesgo que indica cuánto ha caído el valor de una inversión desde su punto máximo histórico hasta un punto mínimo posterior, expresado en porcentaje. Se calcula como: drawdown = (valor máximo − valor mínimo) / valor máximo. A diferencia de la volatilidad, que mide la magnitud de las oscilaciones en general (tanto al alza como a la baja), el drawdown se centra específicamente en las caídas, lo que lo convierte en una medida especialmente intuitiva del \"peor escenario\" que ha vivido —o podría vivir— un inversor. El \"máximo drawdown\" (maximum drawdown, o MDD) de un activo o fondo es la mayor caída porcentual que ha sufrido desde cualquier máximo histórico hasta el mínimo posterior, en todo el periodo analizado, y es uno de los datos que más ayuda a entender la resistencia emocional que exige mantener una inversión concreta. Un fondo con un máximo drawdown histórico del 50% ha llegado a perder, en algún momento, la mitad de su valor desde un máximo anterior, antes de recuperarse (o no). Conocer el máximo drawdown histórico de un activo antes de invertir en él ayuda a valorar, de forma realista, si se tendría la tranquilidad necesaria para no vender en pánico durante una caída de esa magnitud, algo directamente relacionado con el perfil de riesgo de cada inversor.",
    example:
      "Un fondo alcanza un valor de 100€ por participación, y posteriormente cae hasta 70€ antes de empezar a recuperarse. El drawdown de esa caída es del 30% —(100-70)/100—, independientemente de cuánto tiempo haya tardado en producirse o en recuperarse después.",
    relatedCalculator: { href: "/perfil-inversor", label: "Test de perfil de inversor" },
  },
  {
    slug: "renta-fija",
    term: "Renta fija",
    shortDefinition:
      "Activos financieros (como los bonos) que pagan un rendimiento pactado de antemano, con un riesgo generalmente menor.",
    definition:
      "La renta fija engloba los activos financieros —principalmente bonos y obligaciones, emitidos por gobiernos o por empresas— en los que el emisor se compromete, desde el momento de la emisión, a devolver el capital prestado en una fecha determinada (el vencimiento) y a pagar un interés periódico pactado de antemano (el cupón). El término \"fija\" hace referencia a que las condiciones del pago —no necesariamente el precio del activo en el mercado secundario— están fijadas de antemano, a diferencia de la renta variable, donde no existe ninguna promesa de rendimiento. Comprar un bono es, en esencia, prestar dinero al emisor: un bono del Estado español es un préstamo al Tesoro Público; un bono corporativo es un préstamo a una empresa. El riesgo principal de la renta fija es doble: el riesgo de crédito (que el emisor no pueda devolver el dinero, algo mucho más habitual en bonos de empresas con problemas financieros que en deuda pública de países solventes) y el riesgo de tipos de interés (si los tipos de interés generales suben después de comprar un bono, su precio de mercado baja, porque los nuevos bonos que se emiten ofrecen mejores condiciones). En general, y aunque hay excepciones, la renta fija se considera menos volátil y de menor riesgo que la renta variable, por lo que suele tener un peso mayor en las carteras de perfiles conservadores.",
    example:
      "Un bono del Estado a 10 años con un cupón del 3% y un valor nominal de 1.000€ paga 30€ de intereses cada año durante 10 años, y al vencimiento devuelve los 1.000€ iniciales, siempre que el emisor no incurra en impago.",
  },
  {
    slug: "renta-variable",
    term: "Renta variable",
    shortDefinition:
      "Activos como las acciones, cuyo rendimiento no está garantizado y depende de la evolución del precio de mercado.",
    definition:
      "La renta variable engloba los activos financieros —principalmente acciones de empresas cotizadas— cuyo rendimiento no está pactado ni garantizado de antemano: depende por completo de la evolución del precio de mercado del activo y, en su caso, de los dividendos que la empresa decida repartir. A diferencia de la renta fija, donde existe un compromiso contractual de devolución del capital y pago de intereses, comprar una acción significa convertirse en propietario (accionista) de una parte proporcional de la empresa, y el resultado de esa inversión —ganancia o pérdida— depende de cómo evolucione el negocio y de cómo perciba el mercado esa evolución. Esto hace que la renta variable sea, en general, más volátil que la renta fija: los precios pueden subir o bajar de forma notable en periodos cortos de tiempo, en función de resultados empresariales, noticias económicas, cambios en los tipos de interés o el sentimiento general del mercado. A cambio de ese mayor riesgo, la renta variable ha ofrecido históricamente, en periodos largos de varias décadas, una rentabilidad media superior a la de la renta fija, aunque esa rentabilidad superior no está garantizada y pueden existir periodos de varios años con resultados negativos. Por eso la renta variable suele recomendarse principalmente para horizontes temporales largos, que permiten superar los periodos de caída, y para perfiles de riesgo moderados o agresivos.",
    example:
      "Comprar una acción a 50€ que después sube a 65€ genera una ganancia (no garantizada de antemano) del 30% si se vende en ese momento; si en cambio la acción cae a 35€, la pérdida sería del 30%. En renta fija, en cambio, el cupón y la devolución del capital están pactados desde el principio.",
  },
  {
    slug: "fire",
    term: "Número FIRE",
    shortDefinition:
      "El capital que necesitas acumular para vivir de tus inversiones, sin depender de un salario, dividiendo tu gasto anual entre tu tasa de retirada segura.",
    definition:
      "El número FIRE es la cantidad de capital que necesitas acumular para poder vivir de tus inversiones sin depender de un salario. Se calcula dividiendo tu gasto anual entre tu tasa de retirada segura (normalmente el 4%): por ejemplo, si gastas 24.000 € al año y usas una tasa del 4%, tu número FIRE es 600.000 €. FIRE son las siglas de \"Financial Independence, Retire Early\" (independencia financiera, jubilación anticipada), un movimiento popularizado sobre todo en Estados Unidos que defiende ahorrar e invertir de forma agresiva durante los años de vida laboral para poder dejar de depender de un sueldo mucho antes de la edad de jubilación oficial. El número FIRE no es una cifra universal: depende directamente del estilo de vida de cada persona, ya que un gasto anual más alto exige un capital objetivo proporcionalmente mayor, y de la tasa de retirada elegida, que a su vez refleja cuánto riesgo está dispuesta a asumir esa persona de quedarse sin capital antes de tiempo. La tasa de retirada segura habitual del 4% procede de la llamada regla del 4%, basada en estudios históricos sobre cuánto se puede retirar de una cartera diversificada cada año sin agotarla en varias décadas. Alcanzar el número FIRE no implica necesariamente dejar de trabajar por completo: dentro de este movimiento se distinguen variantes como el FIRE \"lean\" (con un gasto anual muy ajustado), el FIRE \"fat\" (con un nivel de gasto más alto) o el \"Coast FIRE\" (haber acumulado ya suficiente capital para que crezca solo hasta la jubilación tradicional, sin necesidad de seguir aportando).",
    example:
      "Alguien que estima un gasto anual de 30.000 € necesita un número FIRE de 750.000 € con una tasa de retirada del 4% (30.000 / 0,04). Si en cambio prefiere ser más conservador y usar una tasa del 3,5%, el número FIRE sube a unos 857.143 € (30.000 / 0,035): cuanto más baja la tasa de retirada elegida, mayor es el capital necesario, porque se asume menos riesgo de agotarlo.",
    relatedCalculator: {
      href: "/calculadoras/numero-fire",
      label: "Calculadora de jubilación (número FIRE)",
    },
  },
  {
    slug: "regla-del-4-por-ciento",
    term: "Regla del 4%",
    shortDefinition:
      "Una guía orientativa que estima que se puede retirar un 4% del capital invertido cada año, ajustado por inflación, sin agotarlo en 30 años.",
    definition:
      "La regla del 4% es una guía orientativa que estima que puedes retirar el 4% de tu capital invertido cada año, ajustado por inflación, con una probabilidad razonable de que ese capital dure al menos 30 años sin agotarse. Se basa en estudios históricos de mercados de EE. UU. (el \"Trinity Study\", publicado en 1998), que analizaron carteras compuestas por acciones y bonos a lo largo de distintos periodos históricos de 30 años, comprobando en qué porcentaje de esos periodos una retirada anual de esa magnitud no habría agotado el capital. Es el punto de partida habitual para calcular el número FIRE, ya que basta con dividir el gasto anual deseado entre esa tasa (o, de forma equivalente, multiplicar el gasto anual por 25) para obtener el capital objetivo. Conviene tener presente que la regla del 4% es una simplificación con limitaciones importantes: se calculó sobre el mercado estadounidense, no necesariamente extrapolable sin más a otros países o a periodos de inversión distintos de 30 años; asume una composición de cartera concreta entre acciones y bonos; y no tiene en cuenta gastos imprevistos grandes, cambios en el estilo de vida o la posibilidad de ajustar el gasto en años de mercado bajista. Por eso, muchas personas dentro de la comunidad FIRE ajustan la tasa a la baja (por ejemplo, al 3% o 3,5%) para ganar margen de seguridad, especialmente si su horizonte de jubilación es más largo de 30 años, o al alza si están dispuestas a asumir más riesgo o a reducir gastos en los años malos.",
    example:
      "Con un capital invertido de 500.000 €, la regla del 4% sugiere que se podrían retirar 20.000 € el primer año (500.000 × 0,04), y esa cantidad se iría ajustando cada año siguiente según la inflación, independientemente de cómo evolucione el valor de la cartera ese año.",
    relatedCalculator: {
      href: "/calculadoras/numero-fire",
      label: "Calculadora de jubilación (número FIRE)",
    },
  },
];
