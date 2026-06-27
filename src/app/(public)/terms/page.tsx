import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de Servicio | AMTME',
  description: 'Términos y condiciones de A Mí Tampoco Me Explicaron.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-20 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[800px]">
        <h1 className="text-4xl font-bold" style={{ color: '#0c1f36' }}>
          Términos de Servicio
        </h1>

        <div
          className="mt-10 space-y-8 text-lg leading-relaxed"
          style={{ color: 'rgba(12, 31, 54, 0.8)' }}
        >
          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              1. Aceptación de Términos
            </h2>
            <p className="mt-4">
              Al usar www.amitampocomeexplicaron.com, aceptas estos términos y condiciones. Si no
              estás de acuerdo, por favor no uses el sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              2. Contenido del Podcast
            </h2>
            <p className="mt-4">
              Todo el contenido del podcast, incluyendo episodios, transcripciones y materiales
              relacionados, está protegido por derechos de autor © A Mí Tampoco Me Explicaron. No se
              permite reproducción sin autorización.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              3. Uso Permitido
            </h2>
            <p className="mt-4">Puedes:</p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>• Escuchar y disfrutar el contenido</li>
              <li>• Compartir episodios (con crédito)</li>
              <li>• Suscribirte a la newsletter</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              4. Uso No Permitido
            </h2>
            <p className="mt-4">No puedes:</p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>• Reproducir contenido comercialmente sin permiso</li>
              <li>• Modificar o crear obras derivadas</li>
              <li>• Distribuir sin crédito atribuido</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              5. Limitación de Responsabilidad
            </h2>
            <p className="mt-4">
              AMTME no es un servicio de terapia profesional. El contenido es informativo y de
              apoyo. Siempre consulta con un profesional de salud mental si lo necesitas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              6. Cambios a los Términos
            </h2>
            <p className="mt-4">
              Podemos actualizar estos términos en cualquier momento. Te notificaremos de cambios
              significativos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              7. Contacto
            </h2>
            <p className="mt-4">Para preguntas: hola@amtme.com</p>
          </section>

          <p className="mt-12 text-sm" style={{ color: 'rgba(12, 31, 54, 0.6)' }}>
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
