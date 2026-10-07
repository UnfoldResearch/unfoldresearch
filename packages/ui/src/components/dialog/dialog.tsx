import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ComponentProps } from "react";

import { XIcon } from "../../icons/icons";
import { cn, mergeClassName } from "../../lib/cn";
import { Button } from "../button/button";

import styles from "./dialog.module.css";

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

export interface DialogContentProps extends BaseDialog.Popup.Props {
  /** Render the corner close button. */
  showClose?: boolean;
}

/** Portal + backdrop + centred popup. */
export function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={styles.backdrop} />
      <BaseDialog.Viewport className={styles.viewport}>
        <BaseDialog.Popup
          className={mergeClassName(styles.popup, className)}
          {...props}
        >
          {children}
          {showClose && (
            <BaseDialog.Close
              render={
                <Button variant="ghost" tone="neutral" size="sm" iconOnly />
              }
              className={styles.close}
              aria-label="Close"
            >
              <XIcon />
            </BaseDialog.Close>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles.header, className)} {...props} />;
}

export function DialogTitle({ className, ...props }: BaseDialog.Title.Props) {
  return (
    <BaseDialog.Title
      className={mergeClassName(styles.title, className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: BaseDialog.Description.Props) {
  return (
    <BaseDialog.Description
      className={mergeClassName(styles.description, className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles.footer, className)} {...props} />;
}
