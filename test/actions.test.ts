import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { setKendoOrStandardValue, fillDisbursementForm, fillPeopleAddForm, fillTransactionAddForm } from '../src/netfile/actions';
import { Contribution } from '../src/types';

describe('Form Actions (actions.ts)', () => {
  let originalDocument: any;
  let originalWindow: any;
  let mockElements: Record<string, any>;

  beforeEach(() => {
    originalDocument = (globalThis as any).document;
    originalWindow = (globalThis as any).window;
    mockElements = {};

    // Mock document
    (globalThis as any).document = {
      getElementById: (id: string) => mockElements[id] || null,
      querySelectorAll: () => [],
    };

    // Mock window
    (globalThis as any).window = globalThis;
    (globalThis as any).Event = class {
      constructor(public type: string, public options?: any) {}
    };
  });

  afterEach(() => {
    (globalThis as any).document = originalDocument;
    (globalThis as any).window = originalWindow;
  });

  function createMockInput(id: string) {
    const input: any = {
      id,
      value: '',
      events: [] as string[],
      parentElement: null,
      dispatchEvent: (e: any) => input.events.push(e.type),
    };
    mockElements[id] = input;
    return input;
  }

  describe('setKendoOrStandardValue', () => {
    it('sets standard input values and dispatches input and change events', () => {
      const input = createMockInput('TestField');
      const ok = setKendoOrStandardValue(input, 'Hello World');

      expect(ok).toBe(true);
      expect(input.value).toBe('Hello World');
      expect(input.events).toContain('input');
      expect(input.events).toContain('change');
    });

    it('synchronizes visible Kendo spinbutton sibling input if present', () => {
      const parent: any = {
        querySelector: (sel: string) => (sel.includes('k-input-inner') ? spinInput : null),
      };
      const spinInput: any = {
        value: '',
        events: [] as string[],
        dispatchEvent: (e: any) => spinInput.events.push(e.type),
      };
      const hiddenInput = createMockInput('Amount');
      hiddenInput.parentElement = parent;

      setKendoOrStandardValue(hiddenInput, '150.00');

      expect(hiddenInput.value).toBe('150.00');
      expect(spinInput.value).toBe('150.00');
      expect(spinInput.events).toContain('input');
      expect(spinInput.events).toContain('change');
    });

    it('calls Kendo widget API if jQuery is available on window', () => {
      let kendoNumericValue = 0;
      let kendoTriggered = false;

      const mockNumericWidget = {
        value: (v: number) => { kendoNumericValue = v; },
        trigger: (evt: string) => { if (evt === 'change') kendoTriggered = true; },
      };

      (globalThis as any).jQuery = (el: any) => ({
        length: 1,
        data: (key: string) => (key === 'kendoNumericTextBox' ? mockNumericWidget : null),
      });

      const input = createMockInput('Amount');
      setKendoOrStandardValue(input, 75.50);

      expect(kendoNumericValue).toBe(75.50);
      expect(kendoTriggered).toBe(true);

      delete (globalThis as any).jQuery;
    });
  });

  describe('fillPeopleAddForm', () => {
    it('fills all individual donor fields into corresponding inputs', () => {
      const fields = [
        'FirstName', 'LastName', 'BusinessAddress_Line1',
        'BusinessAddress_City', 'BusinessAddress_State', 'BusinessAddress_ZipCode',
        'Employer', 'Occupation', 'Email', 'WorkPhone_Phone'
      ];
      for (const f of fields) createMockInput(f);

      const donor: Contribution = {
        id: '1',
        orderNumber: 'AB1',
        firstName: 'Jane',
        lastName: 'Doe',
        fullName: 'Jane Doe',
        amount: '100.00',
        stripeFee: '2.50',
        actblueFee: '1.45',
        totalFee: '3.95',
        netSettlement: '96.05',
        dateUS: '08/10/2026',
        dateISO: '2026-08-10',
        payoutDate: '2026-08-12',
        address: '123 Main St',
        city: 'Mountain View',
        state: 'CA',
        zip: '94040',
        employer: 'Acme Corp',
        occupation: 'Engineer',
        email: 'jane@example.com',
        phone: '650-555-0101',
      };

      const count = fillPeopleAddForm(donor);
      expect(count).toBe(10);
      expect(mockElements['FirstName'].value).toBe('Jane');
      expect(mockElements['LastName'].value).toBe('Doe');
      expect(mockElements['BusinessAddress_Line1'].value).toBe('123 Main St');
      expect(mockElements['Employer'].value).toBe('Acme Corp');
    });
  });

  describe('fillTransactionAddForm', () => {
    it('fills Date and Amount inputs', () => {
      const dateEl = createMockInput('Date');
      const amountEl = createMockInput('Amount');

      const donor: Contribution = {
        id: '1',
        orderNumber: 'AB1',
        firstName: 'Bob',
        lastName: 'Smith',
        fullName: 'Bob Smith',
        amount: '250.00',
        stripeFee: '6.25',
        actblueFee: '3.63',
        totalFee: '9.88',
        netSettlement: '240.12',
        dateUS: '08/11/2026',
        dateISO: '2026-08-11',
        payoutDate: '2026-08-12',
        address: '',
        city: '',
        state: '',
        zip: '',
        employer: '',
        occupation: '',
        email: '',
        phone: '',
      };

      const count = fillTransactionAddForm(donor);
      expect(count).toBe(2);
      expect(dateEl.value).toBe('08/11/2026');
      expect(amountEl.value).toBe('250.00');
    });
  });

  describe('fillDisbursementForm', () => {
    it('fills Date, Amount, Description, and sets FPPC Code to WEB', () => {
      const dateEl = createMockInput('Date');
      const amountEl = createMockInput('Amount');
      const spendEl = createMockInput('FppcSpendCodeDropDownField');
      const descEl = createMockInput('Description');

      const count = fillDisbursementForm({
        date: '08/12/2026',
        amount: '9.88',
        description: 'ActBlue/Stripe processing fee (Bob Smith)',
      });

      expect(count).toBe(4);
      expect(dateEl.value).toBe('08/12/2026');
      expect(amountEl.value).toBe('9.88');
      expect(spendEl.value).toBe('WEB');
      expect(descEl.value).toBe('ActBlue/Stripe processing fee (Bob Smith)');
    });
  });
});
