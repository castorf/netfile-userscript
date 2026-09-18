import { NetFileScreen } from '../types';

export function detectCurrentScreen(
  customUrl?: string,
  customDoc?: {
    getElementById?: (id: string) => any;
    querySelector?: (sel: string) => any;
    body?: { innerText?: string };
  }
): NetFileScreen {
  const url = customUrl !== undefined ? customUrl : (typeof window !== 'undefined' ? window.location.href : '');
  const doc = customDoc !== undefined ? customDoc : (typeof document !== 'undefined' ? document : null);

  if (!doc && !url) return 'Unknown';

  if (url.includes('/Entity/SelectEntity') || doc?.getElementById?.('EntityName')) {
    return 'SelectEntity';
  }

  if (url.includes('/Entity/PeopleAdd') || (doc?.getElementById?.('FirstName') && doc?.getElementById?.('BusinessAddress_Line1'))) {
    return 'PeopleAdd';
  }

  if (url.includes('OrgAdd') || doc?.querySelector?.('iframe[src*="OrgAdd"]')) {
    return 'OrgAdd';
  }

  if (url.includes('Disbursements') || doc?.getElementById?.('FppcSpendCodeDropDownField') || (doc?.body?.innerText || '').includes('Enter a Disbursement')) {
    return 'TransactionAddDisbursement';
  }

  if (url.includes('MonetaryContribution') || (doc?.body?.innerText || '').includes('Enter a Monetary Contribution')) {
    return 'TransactionAddContribution';
  }

  if (url.includes('/Transaction/Add') || (doc?.getElementById?.('Date') && doc?.getElementById?.('Amount'))) {
    return 'TransactionAddContribution';
  }

  return 'Unknown';
}
