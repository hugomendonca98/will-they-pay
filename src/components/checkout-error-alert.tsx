"use client";

import { forwardRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { resolveSiteHref, site } from "@/content/site";

const copy = site.checkout.error;

type CheckoutErrorAlertProps = {
  failureCount: number;
  validationMessage?: string;
};

export const CheckoutErrorAlert = forwardRef<HTMLDivElement, CheckoutErrorAlertProps>(
  function CheckoutErrorAlert({ failureCount, validationMessage }, ref) {
    const showSecondFailure = failureCount >= 2;
    const second = copy.secondFailure;

    return (
      <div ref={ref} tabIndex={-1} className="outline-none">
        <Alert variant="destructive" aria-live="assertive" aria-atomic="true">
          <AlertTitle>{copy.title}</AlertTitle>
          <AlertDescription>
            {validationMessage ? (
              validationMessage
            ) : showSecondFailure ? (
              <span>
                {second.beforeContact}
                <a href={second.contactHref} className="underline underline-offset-3">
                  {second.contactLabel}
                </a>
                {second.betweenLinks}
                <a
                  href={resolveSiteHref(second.issuesHref)}
                  className="underline underline-offset-3"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {second.issuesLabel}
                </a>
                {second.afterIssues}
              </span>
            ) : (
              copy.description
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  },
);
