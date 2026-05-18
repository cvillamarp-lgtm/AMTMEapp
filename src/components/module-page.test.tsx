import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui';
import { ModulePage, Surface, TwoColumnLayout } from '@/components/module-page';

describe('module-page', () => {
  it('renderiza encabezado, acciones y contenido principal del módulo', () => {
    render(
      <ModulePage
        eyebrow="Operación"
        title="Panel de control"
        description="Resumen del estado operativo."
        actions={<Button>Actualizar</Button>}
      >
        <div>Contenido principal</div>
      </ModulePage>
    );

    expect(screen.getByText('Operación')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Panel de control' })).toBeInTheDocument();
    expect(screen.getByText('Resumen del estado operativo.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actualizar' })).toBeInTheDocument();
    expect(screen.getByText('Contenido principal')).toBeInTheDocument();
  });

  it('compone layouts de dos columnas con superficies reutilizables', () => {
    render(
      <TwoColumnLayout
        left={<Surface>Columna izquierda</Surface>}
        right={<Surface>Columna derecha</Surface>}
      />
    );

    expect(screen.getByText('Columna izquierda')).toBeInTheDocument();
    expect(screen.getByText('Columna derecha')).toBeInTheDocument();
  });
});
