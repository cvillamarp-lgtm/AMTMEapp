import { render } from '@testing-library/react';
import { Button } from '@/components/ui';
import { ModulePage, Surface, TwoColumnLayout } from '@/components/module-page';

describe('module-page', () => {
  it('renderiza encabezado, acciones y contenido principal del módulo', () => {
    const { getByText, getByRole } = render(
      <ModulePage
        eyebrow="Operación"
        title="Panel de control"
        description="Resumen del estado operativo."
        actions={<Button>Actualizar</Button>}
      >
        <div>Contenido principal</div>
      </ModulePage>
    );

    expect(getByText('Operación')).toBeInTheDocument();
    expect(getByRole('heading', { name: 'Panel de control' })).toBeInTheDocument();
    expect(getByText('Resumen del estado operativo.')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Actualizar' })).toBeInTheDocument();
    expect(getByText('Contenido principal')).toBeInTheDocument();
  });

  it('compone layouts de dos columnas con superficies reutilizables', () => {
    const { getByText } = render(
      <TwoColumnLayout
        left={<Surface>Columna izquierda</Surface>}
        right={<Surface>Columna derecha</Surface>}
      />
    );

    expect(getByText('Columna izquierda')).toBeInTheDocument();
    expect(getByText('Columna derecha')).toBeInTheDocument();
  });
});
