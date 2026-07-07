import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de Invexia: no hay base de datos ni registro de usuarios, y los resultados de las calculadoras se guardan solo en tu navegador.",
  alternates: {
    canonical: "/legal/privacidad",
  },
};

export default function PrivacidadPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Privacidad" }]} />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Política de privacidad
        </h1>
      </div>

      <div className="flex flex-col gap-8 text-foreground/80">
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            1. No hay registro de usuarios ni base de datos
          </h2>
          <p>
            Invexia no requiere que crees una cuenta ni te registres para usar ninguna de sus
            herramientas. El sitio no tiene una base de datos propia y no almacena en ningún
            servidor información que te identifique personalmente.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            2. Resultados de calculadoras y test de perfil
          </h2>
          <p>
            Los datos que introduces en las calculadoras (importes, plazos, tipos de interés,
            etc.) y las respuestas del test de perfil de inversor se procesan únicamente en tu
            propio navegador y, si se guardan para que puedas retomarlos más tarde, se almacenan
            solo en el almacenamiento local de tu dispositivo (<code>localStorage</code>). Esta
            información nunca se envía a ningún servidor ni es accesible por el titular del
            sitio. Puedes borrarla en cualquier momento desde la configuración de tu navegador.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">3. Asistente conversacional</h2>
          <p>
            Los mensajes que envías al asistente educativo se procesan para generar una
            respuesta y aplicar límites de uso, pero no se vinculan a ningún dato que te
            identifique personalmente ni se conservan con esa finalidad.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">4. Datos de analítica</h2>
          <p>
            {/* PLACEHOLDER: actualizar esta sección si se integra Google Analytics, AdSense u otra herramienta de medición o publicidad */}
            Actualmente este sitio no utiliza herramientas de analítica ni publicidad que
            recojan datos personales de navegación. Si en el futuro se incorpora algún servicio
            de este tipo (por ejemplo, para medir visitas de forma agregada o mostrar
            publicidad), esta política se actualizará para explicar qué datos se recogen, con
            qué finalidad y cómo puedes gestionar tu consentimiento. Consulta también la{" "}
            <a href="/legal/cookies" className="underline hover:text-foreground">
              política de cookies
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">5. Tus derechos</h2>
          <p>
            Como este sitio no almacena datos personales en servidor, no es necesario ejercer
            derechos de acceso, rectificación o supresión sobre información que Invexia
            conserve: la información que generas al usar las calculadoras vive únicamente en tu
            navegador y depende de ti. Para cualquier duda sobre esta política, puedes escribir a{" "}
            [franciscomarare8@gmail.com].
          </p>
          {/* PLACEHOLDER: usa el mismo email de contacto que en el aviso legal */}
        </section>
      </div>
    </main>
  );
}
