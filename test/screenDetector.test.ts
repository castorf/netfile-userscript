import { describe, it, expect } from 'bun:test';
import { detectCurrentScreen } from '../src/netfile/screenDetector';

describe('Screen Detector (detectCurrentScreen)', () => {
  describe('URL-based detection', () => {
    it('detects SelectEntity screen for entity search', () => {
      const url = 'https://netfile.com/Filer/LegacyFree/Entity/SelectEntity?TT=MonetaryContribution';
      expect(detectCurrentScreen(url)).toBe('SelectEntity');
    });

    it('detects PeopleAdd screen for creating an individual', () => {
      const url = 'https://netfile.com/Filer/LegacyFree/Entity/PeopleAdd?inProgressTransactionType=MonetaryContribution';
      expect(detectCurrentScreen(url)).toBe('PeopleAdd');
    });

    it('detects OrgAdd screen for organization modal URL', () => {
      const url = 'https://netfile.com/Filer/LegacyFree/Entity/OrgAdd';
      expect(detectCurrentScreen(url)).toBe('OrgAdd');
    });

    it('detects TransactionAddContribution for monetary contribution', () => {
      const url = 'https://netfile.com/Filer/LegacyFree/Transaction/TransactionAdd?TT=MonetaryContribution';
      expect(detectCurrentScreen(url)).toBe('TransactionAddContribution');
    });

    it('detects TransactionAddDisbursement for disbursement screen', () => {
      const url = 'https://netfile.com/Filer/LegacyFree/Transaction/Disbursement?TT=Disbursements';
      expect(detectCurrentScreen(url)).toBe('TransactionAddDisbursement');
    });

    it('returns Unknown for unrelated URLs', () => {
      const url = 'https://netfile.com/Filer/LegacyFree/Home/Dashboard';
      expect(detectCurrentScreen(url)).toBe('Unknown');
    });
  });

  describe('DOM-fallback detection', () => {
    it('detects SelectEntity if #EntityName input is present in DOM', () => {
      const mockDoc = {
        getElementById: (id: string) => (id === 'EntityName' ? {} : null),
      };
      expect(detectCurrentScreen('', mockDoc)).toBe('SelectEntity');
    });

    it('detects PeopleAdd if #FirstName and #BusinessAddress_Line1 are in DOM', () => {
      const mockDoc = {
        getElementById: (id: string) =>
          id === 'FirstName' || id === 'BusinessAddress_Line1' ? {} : null,
      };
      expect(detectCurrentScreen('', mockDoc)).toBe('PeopleAdd');
    });

    it('detects OrgAdd if modal iframe with src containing OrgAdd is present', () => {
      const mockDoc = {
        querySelector: (sel: string) => (sel.includes('OrgAdd') ? {} : null),
      };
      expect(detectCurrentScreen('', mockDoc)).toBe('OrgAdd');
    });

    it('detects TransactionAddDisbursement if #FppcSpendCodeDropDownField is present', () => {
      const mockDoc = {
        getElementById: (id: string) =>
          id === 'FppcSpendCodeDropDownField' ? {} : null,
      };
      expect(detectCurrentScreen('', mockDoc)).toBe('TransactionAddDisbursement');
    });

    it('detects TransactionAddDisbursement from body text "Enter a Disbursement"', () => {
      const mockDoc = {
        body: { innerText: 'Welcome to NetFile: Enter a Disbursement for Campaign' },
      };
      expect(detectCurrentScreen('', mockDoc)).toBe('TransactionAddDisbursement');
    });

    it('detects TransactionAddContribution from body text "Enter a Monetary Contribution"', () => {
      const mockDoc = {
        body: { innerText: 'Form 460: Enter a Monetary Contribution' },
      };
      expect(detectCurrentScreen('', mockDoc)).toBe('TransactionAddContribution');
    });
  });
});
