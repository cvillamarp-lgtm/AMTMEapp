import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Field, Input } from '@/components/ui';

describe('ui components', () => {
  it('ejecuta acciones de botón y respeta el estado disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <div>
        <Button onClick={onClick}>Guardar</Button>
        <Button onClick={onClick} disabled>
          Bloqueado
        </Button>
      </div>
    );

    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    await user.click(screen.getByRole('button', { name: 'Bloqueado' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('asocia el label del campo con el input y muestra el hint', () => {
    render(
      <Field label="Nombre del módulo" hint="Usa un nombre claro y corto.">
        <Input defaultValue="AMTME Studio OS" />
      </Field>
    );

    expect(screen.getByRole('textbox', { name: /Nombre del módulo/i })).toHaveValue(
      'AMTME Studio OS'
    );
    expect(screen.getByText('Usa un nombre claro y corto.')).toBeInTheDocument();
  });
});
