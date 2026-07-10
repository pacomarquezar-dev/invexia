export interface CalculatorInfo {
  href: string;
  name: string;
  description: string;
}

/**
 * Fuente única de verdad para el listado de calculadoras: home y
 * /calculadoras leen de aquí para no duplicar la lista en dos sitios.
 */
export const calculators: CalculatorInfo[] = [
  {
    href: "/calculadoras/interes-compuesto",
    name: "Calculadora de interés compuesto",
    description:
      "Calcula cuánto puede crecer tu dinero con el interés compuesto a lo largo del tiempo.",
  },
  {
    href: "/calculadoras/dca-vs-pago-unico",
    name: "DCA vs pago único",
    description:
      "Compara invertir todo tu capital de golpe frente a repartirlo en aportaciones periódicas.",
  },
  {
    href: "/calculadoras/coste-comisiones",
    name: "Coste real de las comisiones",
    description:
      "Compara tres escenarios de comisión anual (baja, media y alta) y descubre cuánto se llevan a largo plazo.",
  },
  {
    href: "/calculadoras/objetivo-ahorro",
    name: "Objetivo de ahorro",
    description:
      "Calcula cuánto tienes que aportar cada mes para alcanzar tu objetivo de ahorro en el plazo que elijas.",
  },
  {
    href: "/calculadoras/numero-fire",
    name: "Calculadora de jubilación (número FIRE)",
    description:
      "Calcula el capital que necesitas para la independencia financiera y cuántos años te faltan para alcanzarlo.",
  },
  {
    href: "/calculadoras/inflacion-poder-adquisitivo",
    name: "Inflación y poder adquisitivo",
    description:
      "Calcula cuánto poder adquisitivo real perderá tu dinero por la inflación en los próximos años.",
  },
];
