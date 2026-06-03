'use client';

import { Card, Badge, Button, Input, Textarea, Field } from '@/components/ui';

export default function InstagramPage() {
  return (
    <div className="space-y-5 pb-24">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/40">
          Distribución
        </div>
        <h1 className="mt-1 text-[28px] font-bold tracking-[-0.03em] text-[#0C1F36]">Instagram</h1>
        <p className="mt-1 text-[13px] text-[#6B7B8C]">
          Publica imágenes directamente desde Studio OS.
        </p>
      </div>

      <Card>
        <div className="flex flex-col items-center py-12 text-center">
          <div className="text-5xl">📸</div>
          <h2 className="mt-4 text-[18px] font-bold text-[#0C1F36]">
            Conecta tu cuenta de Instagram
          </h2>
          <p className="mt-2 max-w-sm text-[13px] text-[#6B7B8C]">
            Necesitas un Access Token y User ID de Instagram Graph API para publicar directamente
            desde aquí.
          </p>

          <div className="mt-6 w-full max-w-sm space-y-3 text-left">
            <Field label="Access Token">
              <Input type="password" placeholder="IGQVJXa1..." disabled />
            </Field>
            <Field label="Instagram User ID">
              <Input placeholder="17841..." disabled />
            </Field>
          </div>

          <div className="mt-6 rounded-2xl border border-[#FEE94B] bg-[#FEE94B]/10 px-5 py-4 text-left max-w-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0C1F36]/50">
              Cómo obtener credenciales
            </p>
            <ol className="mt-2 space-y-1 text-[12px] text-[#0C1F36]">
              <li>1. Ve a Facebook Developers y crea una app</li>
              <li>2. Agrega el producto "Instagram Graph API"</li>
              <li>3. Genera un Access Token de larga duración</li>
              <li>4. Obtén tu Instagram User ID</li>
            </ol>
          </div>

          <div className="mt-5 flex gap-2">
            <Button variant="secondary" href="https://developers.facebook.com">
              Ir a Facebook Developers →
            </Button>
            <Badge tone="neutral">Próximamente</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
