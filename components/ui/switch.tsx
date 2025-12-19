import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@rn-primitives/switch';
import { Platform } from 'react-native';

function Switch({
  className,
  ...props
}: SwitchPrimitives.RootProps & React.RefAttributes<SwitchPrimitives.RootRef>) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        'shadow-black/5 flex h-6 w-11 shrink-0 flex-row items-center rounded-full border border-transparent shadow-sm',
        Platform.select({
          web: 'peer inline-flex outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed',
        }),
        props.checked ? 'bg-[#3A3A41]' : 'bg-[#B4B4BC]',
        props.disabled && 'opacity-50',
        className
      )}
      {...props}>
      <SwitchPrimitives.Thumb
        className={cn(
          'size-5 rounded-full bg-white transition-transform',
          Platform.select({
            web: 'pointer-events-none block ring-0',
          }),
          props.checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };
