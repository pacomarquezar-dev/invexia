import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Política de cookies de Invexia: qué cookies y almacenamiento local se usan actualmente y por qué.",
  alternates: {
    canonical: "/legal/cookies",
  },
};

export default function CookiesPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Cookies" }]} />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Política de cookies
        </h1>
      </div>

      <div className="flex flex-col gap-8 text-foreground/80">
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            1. Qué usa Invexia actualmente
          </h2>
          <p>
            Invexia no instala cookies de analítica ni de publicidad en su versión actual. La
            única tecnología de almacenamiento en tu dispositivo que utiliza es el{" "}
            <code>localStorage</code> del navegador, que técnicamente no es una cookie: no se
            envía al servidor en cada petición y solo es accesible por este sitio desde tu propio
            navegador.
          </p>
          <p>
            Este almacenamiento local se usa para guardar, de forma opcional, los resultados que
            generas en las calculadoras y las respuestas del test de perfil de inversor, para que
            puedas retomarlos si vuelves a visitar la página. No tiene ninguna finalidad de
            seguimiento ni se comparte con terceros.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            2. Cookies técnicas o funcionales
          </h2>
          <p>
            Es posible que el propio hosting del sitio (Vercel) utilice cookies estrictamente
            necesarias para el funcionamiento técnico de la infraestructura (por ejemplo, para
            balanceo de carga). Estas cookies no requieren consentimiento porque son
            imprescindibles para prestar el servicio y no se usan con fines de seguimiento ni
            publicitarios.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            3. Cookies de analítica y publicidad (previsión)
          </h2>
          <p>
            {/* PLACEHOLDER: completar esta sección cuando se integre Google AdSense / Funding Choices u otra herramienta de analítica */}
            Invexia se financia mediante publicidad (Google AdSense). Cuando esta integración se
            active, podrán instalarse cookies de terceros con fines de medición de audiencia o
            publicidad personalizada. Antes de que eso ocurra, se incorporará aquí un gestor de
            consentimiento (Google Funding Choices o equivalente) que te permitirá aceptar,
            rechazar o configurar estas cookies antes de que se instalen, y esta página se
            actualizará con el detalle de cada cookie: su nombre, finalidad, duración y si es
            propia o de un tercero.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            4. Cómo gestionar o borrar el almacenamiento local
          </h2>
          <p>
            Puedes borrar en cualquier momento los datos guardados en <code>localStorage</code>{" "}
            desde la configuración de privacidad de tu navegador (normalmente en el apartado de
            &quot;datos de sitios&quot; o &quot;almacenamiento&quot;), sin que eso afecte a tu
            capacidad de seguir usando las calculadoras de Invexia.
          </p>
        </section>
      </div>
    </main>
  );
}
