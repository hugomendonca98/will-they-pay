/** @vitest-environment jsdom */

import { cleanup, render, screen, within } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { afterEach, describe, expect, it } from "vitest";
import { CheckoutErrorAlert } from "@/components/checkout-error-alert";
import { site } from "@/content/site";

const copy = site.checkout.error;

afterEach(() => {
  cleanup();
});

describe("CheckoutErrorAlert", () => {
  it("shows the first-failure description", () => {
    render(<CheckoutErrorAlert failureCount={1} />);

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText(copy.title)).toBeTruthy();
    expect(screen.getByText(copy.description)).toBeTruthy();
  });

  it("shows contact and GitHub links after a second failure", () => {
    render(<CheckoutErrorAlert failureCount={2} />);

    const contact = screen.getByRole("link", { name: copy.secondFailure.contactLabel });
    expect(contact.getAttribute("href")).toBe(copy.secondFailure.contactHref);

    const issues = screen.getByRole("link", { name: copy.secondFailure.issuesLabel });
    expect(issues.getAttribute("href")).toContain("github.com");
  });

  it("shows validation message when provided", () => {
    render(
      <CheckoutErrorAlert failureCount={1} validationMessage="E-mail inválido." />,
    );

    const alert = screen.getByRole("alert");
    expect(within(alert).getByText("E-mail inválido.")).toBeTruthy();
    expect(within(alert).queryByText(copy.description)).toBeNull();
  });
});

describe("checkout modal field preservation", () => {
  it("keeps typed values in uncontrolled inputs after an error alert is shown", () => {
    render(
      <form>
        <CheckoutErrorAlert failureCount={1} />
        <label htmlFor="checkout-name">Nome</label>
        <input id="checkout-name" name="name" defaultValue="" />
      </form>,
    );

    const nameInput = screen.getByLabelText("Nome") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Maria Demo" } });
    expect(nameInput.value).toBe("Maria Demo");
  });
});
