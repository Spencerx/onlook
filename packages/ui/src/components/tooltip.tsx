import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '../utils';

function TooltipProvider({
    delayDuration = 0,
    disableHoverableContent = false,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            disableHoverableContent={disableHoverableContent}
            {...props}
        />
    );
}

function Tooltip({
    delayDuration,
    disableHoverableContent,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
    delayDuration?: number;
    disableHoverableContent?: boolean;
}) {
    return (
        <TooltipProvider
            delayDuration={delayDuration}
            disableHoverableContent={disableHoverableContent}
        >
            <TooltipPrimitive.Root data-slot="tooltip" {...props} />
        </TooltipProvider>
    );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
    className,
    sideOffset = 5,
    children,
    hideArrow = false,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & { hideArrow?: boolean }) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                sideOffset={sideOffset}
                className={cn(
                    'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
                    className,
                )}
                {...props}
            >
                {children}
                {!hideArrow && (
                    <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
                )}
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    );
}

const TooltipPortal = TooltipPrimitive.Portal;

export { Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger };
