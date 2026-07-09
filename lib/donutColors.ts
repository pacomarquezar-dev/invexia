/**
 * Colores compartidos por los 4 gráficos donut del proyecto. Viven en un
 * módulo aparte (sin importar recharts) para que las calculadoras puedan
 * referenciarlos sin forzar la carga anticipada del chunk de DonutChart.
 */

/** Verde protagonista: la parte "buena" del resultado (conservado / intereses). Recibe el glow. */
export const DONUT_HERO_COLOR = "#3DDC84";
/** Terracota: la parte que se pierde (comisión, poder adquisitivo). */
export const DONUT_LOSS_COLOR = "#C97B63";
/** Verde grisáceo apagado: segmentos de fondo que no son el protagonista (nunca gris plano). */
export const DONUT_MUTED_COLOR = "#4A5A52";
