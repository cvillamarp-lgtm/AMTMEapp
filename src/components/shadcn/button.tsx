import { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amtme-yellow',
  {
    variants: {
      variant: {
        // AMTME Primary: Navy background, yellow text
        default: 'bg-amtme-navy text-amtme-yellow hover:bg-amtme-charcoal shadow-soft',
        // AMTME Secondary: Yellow background, navy text
        secondary: 'bg-amtme-yellow text-amtme-navy hover:bg-amtme-yellow/90 shadow-soft',
        // AMTME Ghost: Transparent, yellow on hover
        ghost: 'text-amtme-yellow hover:bg-amtme-white/10',
        // Destructive: Red
        destructive: 'bg-amtme-red text-amtme-white hover:bg-amtme-red/90 shadow-soft',
        // Outline: Border style
        outline: 'border-2 border-amtme-yellow text-amtme-yellow hover:bg-amtme-yellow/10',
        // Subtle: Minimal styling
        subtle: 'text-amtme-white hover:bg-amtme-white/10',
        // Link style
        link: 'text-amtme-yellow underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 rounded-md px-3 gap-1.5',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 rounded-md px-6',
        icon: 'size-10',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
