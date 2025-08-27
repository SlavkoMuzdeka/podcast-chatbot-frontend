"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border-2 p-6 pr-8 shadow-2xl transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full backdrop-blur-xl ring-1",
  {
    variants: {
      variant: {
        default:
          "border-slate-300 bg-white text-slate-900 ring-slate-200 shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:shadow-slate-900/50",
        destructive:
          "border-red-400 bg-red-50 text-red-900 ring-red-300 shadow-red-200/50 dark:border-red-600 dark:bg-red-950 dark:text-red-100 dark:ring-red-600 dark:shadow-red-900/50",
        success:
          "border-emerald-400 bg-emerald-50 text-emerald-900 ring-emerald-300 shadow-emerald-200/50 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100 dark:ring-emerald-600 dark:shadow-emerald-900/50",
        warning:
          "border-amber-400 bg-amber-50 text-amber-900 ring-amber-300 shadow-amber-200/50 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-100 dark:ring-amber-600 dark:shadow-amber-900/50",
        info: "border-blue-400 bg-blue-50 text-blue-900 ring-blue-300 shadow-blue-200/50 dark:border-blue-600 dark:bg-blue-950 dark:text-blue-100 dark:ring-blue-600 dark:shadow-blue-900/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-lg p-1.5 text-foreground/60 opacity-70 transition-all hover:text-foreground hover:opacity-100 hover:bg-black/5 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1 group-hover:opacity-100 group-[.destructive]:text-red-400 group-[.destructive]:hover:text-red-100 group-[.destructive]:hover:bg-red-500/20 group-[.destructive]:focus:ring-red-400 group-[.success]:text-emerald-400 group-[.success]:hover:text-emerald-100 group-[.success]:hover:bg-emerald-500/20 group-[.success]:focus:ring-emerald-400 group-[.warning]:text-amber-400 group-[.warning]:hover:text-amber-100 group-[.warning]:hover:bg-amber-500/20 group-[.warning]:focus:ring-amber-400 group-[.info]:text-blue-400 group-[.info]:hover:text-blue-100 group-[.info]:hover:bg-blue-500/20 group-[.info]:focus:ring-blue-400 dark:hover:bg-white/10",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "text-lg font-bold leading-tight tracking-tight mb-1",
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm font-medium opacity-95 leading-relaxed", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

const ToastIcon = ({
  variant,
}: {
  variant?: VariantProps<typeof toastVariants>["variant"];
}) => {
  const iconClass = "h-6 w-6 flex-shrink-0 mr-3";

  switch (variant) {
    case "success":
      return (
        <CheckCircle
          className={cn(iconClass, "text-emerald-600 dark:text-emerald-400")}
        />
      );
    case "destructive":
      return (
        <AlertCircle
          className={cn(iconClass, "text-red-600 dark:text-red-400")}
        />
      );
    case "warning":
      return (
        <AlertTriangle
          className={cn(iconClass, "text-amber-600 dark:text-amber-400")}
        />
      );
    case "info":
      return (
        <Info className={cn(iconClass, "text-blue-600 dark:text-blue-400")} />
      );
    default:
      return (
        <Info className={cn(iconClass, "text-slate-600 dark:text-slate-400")} />
      );
  }
};

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastIcon,
};
