"use client";

import * as React from "react";
import { Textarea, type TextareaProps } from "./textarea";

export interface AutoResizeTextareaProps extends TextareaProps {
  maxRows?: number;
}

export const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(({ maxRows = 8, className, onChange, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [textareaLineHeight, setTextareaLineHeight] = React.useState(24);

  React.useImperativeHandle(
    ref,
    () => textareaRef.current as HTMLTextAreaElement
  );

  // Calculate line height on mount
  React.useEffect(() => {
    if (textareaRef.current) {
      const style = window.getComputedStyle(textareaRef.current);
      const lineHeight = Number.parseInt(style.lineHeight) || 24;
      setTextareaLineHeight(lineHeight);
    }
  }, []);

  // Auto-resize on input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate new height
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, textareaLineHeight),
      maxRows * textareaLineHeight
    );

    textarea.style.height = `${newHeight}px`;

    // Call the original onChange handler
    if (onChange) {
      onChange(e);
    }
  };

  // Auto-resize on initial render and when value changes
  React.useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";

      // Calculate new height
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, textareaLineHeight),
        maxRows * textareaLineHeight
      );

      textarea.style.height = `${newHeight}px`;
    }
  }, [props.value, textareaLineHeight, maxRows]);

  return (
    <Textarea
      ref={(el) => {
        textareaRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      onChange={handleChange}
      className={className}
      rows={1}
      {...props}
    />
  );
});
AutoResizeTextarea.displayName = "AutoResizeTextarea";
