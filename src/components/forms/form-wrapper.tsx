'use client';

import { ReactNode } from 'react';
import { useForm, UseFormProps, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { Button } from '@/components/shadcn/button';

interface FormWrapperProps<T extends ZodSchema> extends Omit<UseFormProps, 'resolver'> {
  schema: T;
  children: ReactNode;
  onSubmit: SubmitHandler<any>;
  submitLabel?: string;
  loading?: boolean;
  onCancel?: () => void;
}

export function FormWrapper<T extends ZodSchema>({
  schema,
  children,
  onSubmit,
  submitLabel = 'Guardar',
  loading = false,
  onCancel,
  ...formProps
}: FormWrapperProps<T>) {
  const methods = useForm({
    ...formProps,
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
      {/* Children receive methods via context - wrap with FormProvider if needed */}
      {children}

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
