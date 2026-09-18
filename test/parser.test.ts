import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parseCSV, convertActBlueCSV, computePayoutBatches } from '../src/parser';
import { Contribution } from '../src/types';

describe('CSV Parser (parseCSV)', () => {
  it('should parse simple unquoted CSV rows', () => {
    const csv = 'Name,Amount,City\nAlice,100,San Jose\nBob,250,Palo Alto';
    const parsed = parseCSV(csv);
    expect(parsed).toEqual([
      { Name: 'Alice', Amount: '100', City: 'San Jose' },
      { Name: 'Bob', Amount: '250', City: 'Palo Alto' },
    ]);
  });

  it('should handle values containing commas wrapped in double quotes', () => {
    const csv = 'Name,Address,Amount\n"Smith, Jr., John","123 Main St, Apt 4",100.00';
    const parsed = parseCSV(csv);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].Name).toBe('Smith, Jr., John');
    expect(parsed[0].Address).toBe('123 Main St, Apt 4');
    expect(parsed[0].Amount).toBe('100.00');
  });

  it('should handle escaped quotes inside quotes ("")', () => {
    const csv = 'ID,Comment\n1,"He said ""Hello"" to everyone"';
    const parsed = parseCSV(csv);
    expect(parsed[0].Comment).toBe('He said "Hello" to everyone');
  });

  it('should handle Windows CRLF line endings', () => {
    const csv = 'Header1,Header2\r\nVal1,Val2\r\nVal3,Val4\r\n';
    const parsed = parseCSV(csv);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toEqual({ Header1: 'Val1', Header2: 'Val2' });
    expect(parsed[1]).toEqual({ Header1: 'Val3', Header2: 'Val4' });
  });

  it('should return empty array for empty or header-only CSV', () => {
    expect(parseCSV('')).toEqual([]);
    expect(parseCSV('Header1,Header2')).toEqual([]);
  });
});

describe('ActBlue Conversion (convertActBlueCSV)', () => {
  const sampleCSV = `Lineitem ID,Order Number,Processor Txn ID,Amount,Txn Amount,Stripe Fee Amount,Fee,Net Settlement,Contribution Datetime,Paid At,Created Datetime,Payout Datetime,Transaction Type,Description,Is Recurring,Recurrence Number,Pledged Recurring Duration,Recipient,Recipient Committee,Recipient ID,Recipient Gov ID,Donor First Name,Donor Last Name,Donor Address Line 1,Donor City,Donor State,Donor ZIP,Donor Country,Donor Occupation,Donor Employer,Donor Email,Donor Phone,Employer Address Line 1,Employer City,Employer State,Employer Zip,Employer Country,Via Mobile,Recurring Amount,Initial Recurring Contribution Date,Cancelled Recurring?,Donor U.S. Passport Number,Donor U.S. Citizenship Verified,Payment Method,Card Type,Card Last 4,Card Expiration,Card AVS
1001,AB10001,ch_1,100.00,100.00,2.50,1.45,96.05,2026-08-10 14:22:00,2026-08-10 14:22:00,2026-08-10 14:22:00,2026-08-12 09:00:00,Contribution,,false,,,Sample Campaign,Sample Committee,123456,,Jane,Doe,123 Main St,Mountain View,CA,94040,United States,Software Engineer,Acme Corp,jane.doe@example.com,650-555-0101,,,,,,,false,,,,,true,Credit Card,Visa,4242,12/28,Pass`;

  it('should convert raw CSV rows into typed Contribution objects', () => {
    const contributions = convertActBlueCSV(sampleCSV);
    expect(contributions).toHaveLength(1);

    const c = contributions[0];
    expect(c.firstName).toBe('Jane');
    expect(c.lastName).toBe('Doe');
    expect(c.fullName).toBe('Jane Doe');
    expect(c.amount).toBe('100.00');
    expect(c.stripeFee).toBe('2.50');
    expect(c.actblueFee).toBe('1.45');
    expect(c.totalFee).toBe('3.95');
    expect(c.netSettlement).toBe('96.05');
    expect(c.dateUS).toBe('08/10/2026');
    expect(c.dateISO).toBe('2026-08-10');
    expect(c.payoutDate).toBe('2026-08-12');
    expect(c.address).toBe('123 Main St');
    expect(c.city).toBe('Mountain View');
    expect(c.state).toBe('CA');
    expect(c.zip).toBe('94040');
    expect(c.employer).toBe('Acme Corp');
    expect(c.occupation).toBe('Software Engineer');
    expect(c.email).toBe('jane.doe@example.com');
    expect(c.phone).toBe('650-555-0101');
  });

  it('should correctly parse the bundled sample-actblue.csv fixture', () => {
    const fixturePath = resolve(__dirname, '../sample-actblue.csv');
    const content = readFileSync(fixturePath, 'utf-8');
    const contributions = convertActBlueCSV(content);

    expect(contributions).toHaveLength(3);
    expect(contributions[0].fullName).toBe('Jane Doe');
    expect(contributions[1].fullName).toBe('Robert Smith');
    expect(contributions[2].fullName).toBe('Alice Johnson');

    // Verify fee calculations
    expect(contributions[0].totalFee).toBe('3.95');
    expect(contributions[1].totalFee).toBe('9.88');
    expect(contributions[2].totalFee).toBe('1.98');
  });

  it('should calculate net settlement if missing from raw data', () => {
    const raw = `Amount,Stripe Fee Amount,Fee,Donor First Name,Donor Last Name
50.00,1.25,0.73,John,Smith`;
    const res = convertActBlueCSV(raw);
    expect(res).toHaveLength(1);
    expect(res[0].amount).toBe('50.00');
    expect(res[0].totalFee).toBe('1.98');
    expect(res[0].netSettlement).toBe('48.02');
  });
});

describe('Payout Batches (computePayoutBatches)', () => {
  it('should group contributions by payout date and sum fees correctly', () => {
    const mockContributions: Contribution[] = [
      {
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
        employer: 'Acme',
        occupation: 'Engineer',
        email: 'jane@example.com',
        phone: '650-555-0101',
      },
      {
        id: '2',
        orderNumber: 'AB2',
        firstName: 'Bob',
        lastName: 'Smith',
        fullName: 'Bob Smith',
        amount: '200.00',
        stripeFee: '5.00',
        actblueFee: '2.90',
        totalFee: '7.90',
        netSettlement: '192.10',
        dateUS: '08/11/2026',
        dateISO: '2026-08-11',
        payoutDate: '2026-08-12',
        address: '456 Oak St',
        city: 'Los Altos',
        state: 'CA',
        zip: '94022',
        employer: 'School',
        occupation: 'Teacher',
        email: 'bob@example.com',
        phone: '650-555-0102',
      },
      {
        id: '3',
        orderNumber: 'AB3',
        firstName: 'Alice',
        lastName: 'Jones',
        fullName: 'Alice Jones',
        amount: '50.00',
        stripeFee: '1.25',
        actblueFee: '0.73',
        totalFee: '1.98',
        netSettlement: '48.02',
        dateUS: '08/15/2026',
        dateISO: '2026-08-15',
        payoutDate: '2026-08-18',
        address: '789 Pine St',
        city: 'Sunnyvale',
        state: 'CA',
        zip: '94086',
        employer: 'Self',
        occupation: 'Consultant',
        email: 'alice@example.com',
        phone: '408-555-0103',
      },
    ];

    const batches = computePayoutBatches(mockContributions);
    expect(batches).toHaveLength(2);

    // Batch 1 (2026-08-12)
    expect(batches[0].payoutDate).toBe('2026-08-12');
    expect(batches[0].count).toBe(2);
    expect(batches[0].gross).toBe('300.00');
    expect(batches[0].stripeFee).toBe('7.50');
    expect(batches[0].actblueFee).toBe('4.35');
    expect(batches[0].totalFee).toBe('11.85');
    expect(batches[0].net).toBe('288.15');

    // Batch 2 (2026-08-18)
    expect(batches[1].payoutDate).toBe('2026-08-18');
    expect(batches[1].count).toBe(1);
    expect(batches[1].gross).toBe('50.00');
    expect(batches[1].totalFee).toBe('1.98');
  });

  it('should group items without payout date under "Unsettled"', () => {
    const pendingItem: Contribution = {
      id: '4',
      orderNumber: 'AB4',
      firstName: 'Tom',
      lastName: 'Brown',
      fullName: 'Tom Brown',
      amount: '25.00',
      stripeFee: '0.63',
      actblueFee: '0.36',
      totalFee: '0.99',
      netSettlement: '24.01',
      dateUS: '08/20/2026',
      dateISO: '2026-08-20',
      payoutDate: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      employer: '',
      occupation: '',
      email: '',
      phone: '',
    };

    const batches = computePayoutBatches([pendingItem]);
    expect(batches).toHaveLength(1);
    expect(batches[0].payoutDate).toBe('Unsettled');
  });
});
