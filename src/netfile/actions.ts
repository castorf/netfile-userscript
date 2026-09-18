import { Contribution } from '../types';

/**
 * Searches for an element in the main document or inside any modal iframe
 */
export function getElement(id: string): HTMLElement | null {
  const el = document.getElementById(id);
  if (el) return el;

  for (const iframe of Array.from(document.querySelectorAll('iframe'))) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const frameEl = doc.getElementById(id);
        if (frameEl) return frameEl;
      }
    } catch {
      // ignore cross-origin
    }
  }
  return null;
}

/**
 * Robust value setter handling Kendo UI widgets (NumericTextBox, DropDownList, DatePicker)
 * as well as standard DOM form elements.
 */
export function setKendoOrStandardValue(el: HTMLElement | null, value: string | number): boolean {
  if (!el || value === undefined || value === null) return false;

  const win = window as any;
  const $ = win.jQuery || win.$;

  // 1. Kendo UI widget integration (NetFile's underlying framework)
  if ($ && $(el).length) {
    // NumericTextBox (e.g. #Amount)
    const numeric = $(el).data('kendoNumericTextBox');
    if (numeric) {
      const num = typeof value === 'number' ? value : parseFloat(value.toString());
      numeric.value(isNaN(num) ? 0 : num);
      numeric.trigger('change');
    }

    // DropDownList (e.g. #FppcSpendCodeDropDownField)
    const drop = $(el).data('kendoDropDownList');
    if (drop) {
      drop.value(value.toString());
      drop.trigger('change');
    }

    // DatePicker (e.g. #Date)
    const datePicker = $(el).data('kendoDatePicker');
    if (datePicker) {
      datePicker.value(value.toString());
      datePicker.trigger('change');
    }
  }

  // 2. Visible Kendo inner input elements (e.g. spinbutton wrapper)
  const parent = el.parentElement;
  if (parent) {
    const visibleInner = parent.querySelector('input.k-input-inner, input[role="spinbutton"]') as HTMLInputElement | null;
    if (visibleInner && visibleInner !== el) {
      visibleInner.value = value.toString();
      visibleInner.dispatchEvent(new Event('input', { bubbles: true }));
      visibleInner.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  // 3. Standard DOM input
  if ('value' in el) {
    (el as HTMLInputElement).value = value.toString();
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  return true;
}

export function setInputValue(el: HTMLElement | null, value: string): boolean {
  return setKendoOrStandardValue(el, value);
}

/**
 * Screen 1: Search for an Entity
 */
export function searchEntity(donorName: string): boolean {
  const input = getElement('EntityName') as HTMLInputElement | null;
  const btn = getElement('btnSearch') as HTMLElement | null;

  if (input && btn) {
    setKendoOrStandardValue(input, donorName);
    btn.click();
    return true;
  }
  return false;
}

/**
 * Screen 1 -> Screen 2: Click "Create a New Individual"
 */
export function navigateToCreateIndividual(): boolean {
  const link = document.querySelector('a.nf-button-proceed[href*="PeopleAdd"]') as HTMLAnchorElement | null;
  if (link) {
    link.click();
    return true;
  }
  window.location.href = 'https://netfile.com/Filer/LegacyFree/Entity/PeopleAdd?inProgressTransactionType=MonetaryContribution';
  return true;
}

/**
 * Screen 2: Fill "Add a New Individual" form
 */
export function fillPeopleAddForm(c: Contribution): number {
  let count = 0;

  const map: [string, string][] = [
    ['FirstName', c.firstName],
    ['LastName', c.lastName],
    ['BusinessAddress_Line1', c.address],
    ['BusinessAddress_City', c.city],
    ['BusinessAddress_State', c.state],
    ['BusinessAddress_ZipCode', c.zip],
    ['Employer', c.employer],
    ['Occupation', c.occupation],
    ['Email', c.email],
    ['WorkPhone_Phone', c.phone],
  ];

  for (const [id, val] of map) {
    const el = getElement(id);
    if (el && val) {
      setKendoOrStandardValue(el, val);
      count++;
    }
  }

  return count;
}

/**
 * Modal: Fill "Create a New Organization" form
 */
export function fillOrganizationAddForm(c: Contribution): number {
  let count = 0;

  const map: [string, string][] = [
    ['Name', c.employer && c.employer !== 'Not Employed' ? c.employer : c.fullName],
    ['BusinessAddress_Line1', c.address],
    ['BusinessAddress_City', c.city],
    ['BusinessAddress_State', c.state],
    ['BusinessAddress_ZipCode', c.zip],
    ['Email', c.email],
    ['WorkPhone_Phone', c.phone],
  ];

  for (const [id, val] of map) {
    const el = getElement(id);
    if (el && val) {
      setKendoOrStandardValue(el, val);
      count++;
    }
  }

  return count;
}

/**
 * Screen 3: Fill "Enter a Monetary Contribution" form
 */
export function fillTransactionAddForm(c: Contribution): number {
  let count = 0;

  const dateInput = getElement('Date');
  if (dateInput && c.dateUS) {
    setKendoOrStandardValue(dateInput, c.dateUS);
    count++;
  }

  const amountInput = getElement('Amount');
  if (amountInput && c.amount) {
    setKendoOrStandardValue(amountInput, c.amount);
    count++;
  }

  return count;
}

/**
 * Screen: Fill "Enter a Disbursement" form for Fees
 * Sets Date, Amount, Expenditure Type (WEB), and Description.
 */
export function fillDisbursementForm(opts: {
  date: string;
  amount: string;
  description: string;
  spendCode?: string;
}): number {
  let count = 0;

  const dateInput = getElement('Date');
  if (dateInput && opts.date) {
    setKendoOrStandardValue(dateInput, opts.date);
    count++;
  }

  const amountInput = getElement('Amount');
  if (amountInput && opts.amount) {
    setKendoOrStandardValue(amountInput, opts.amount);
    count++;
  }

  // Set Expenditure Type (defaults to 'WEB' - Information Technology Costs)
  const spendCode = opts.spendCode || 'WEB';
  const spendInput = getElement('FppcSpendCodeDropDownField');
  if (spendInput) {
    setKendoOrStandardValue(spendInput, spendCode);
    count++;
  }

  const descInput = getElement('Description');
  if (descInput && opts.description) {
    setKendoOrStandardValue(descInput, opts.description);
    count++;
  }

  return count;
}
