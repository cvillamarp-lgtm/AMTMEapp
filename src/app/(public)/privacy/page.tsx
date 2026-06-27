import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | AMTME',
  description: 'Política de privacidad y protección de datos de A Mí Tampoco Me Explicaron.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-20 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[800px]">
        <h1 className="text-4xl font-bold" style={{ color: '#0c1f36' }}>
          Política de Privacidad
        </h1>

        <div
          className="mt-10 space-y-8 text-lg leading-relaxed"
          style={{ color: 'rgba(12, 31, 54, 0.8)' }}
        >
          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              1. Introducción
            </h2>
            <p className="mt-4">
              En A Mí Tampoco Me Explicaron (AMTME), nos comprometemos a proteger tu privacidad.
              Esta política describe cómo recopilamos, usamos y protegemos tus datos personales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              2. Datos que Recopilamos
            </h2>
            <p className="mt-4">Recopilamos:</p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>• Dirección de correo electrónico (para newsletter)</li>
              <li>• Información de navegación (mediante Analytics)</li>
              <li>• Datos voluntariamente compartidos (formularios de contacto)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              3. Cómo Usamos Tus Datos
            </h2>
            <p className="mt-4">Usamos tus datos para:</p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>• Enviarte la newsletter "Carta Emocional"</li>
              <li>• Mejorar tu experiencia en el sitio</li>
              <li>• Responder tus consultas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              4. Derechos GDPR
            </h2>
            <p className="mt-4">
              Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier
              momento. Para ejercer estos derechos, contacta a hola@amtme.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold" style={{ color: '#0c1f36' }}>
              5. Contacto
            </h2>
            <p className="mt-4">Para preguntas sobre privacidad: hola@amtme.com</p>
          </section>

          <p className="mt-12 text-sm" style={{ color: 'rgba(12, 31, 54, 0.6)' }}>
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
