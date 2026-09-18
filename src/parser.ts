import { Contribution, PayoutBatch } from './types';

/**
 * Robust RFC-4180 compliant client-side CSV parser.
 * Works entirely in-browser with zero external dependencies.
 */
export function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentVal += '"';
        i++; // Skip escaped quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentVal.trim());
      currentVal = '';
      if (currentRow.length > 1 || currentRow[0] !== '') {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentVal += char;
    }
  }

  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.length > 1 || currentRow[0] !== '') {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim());
  const results: Record<string, string>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const obj: Record<string, string> = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = row[c] ?? '';
    }
    results.push(obj);
  }

  return results;
}

/**
 * Converts parsed CSV rows into typed Contribution objects.
 */
export function convertActBlueCSV(csvText: string): Contribution[] {
  const records = parseCSV(csvText);

  return records
    .filter(r => r['Amount'] || r['Donor Last Name'])
    .map(r => {
      const dtRaw = (r['Contribution Datetime'] || r['Paid At'] || '').split(' ')[0] || '';
      let dateUS = '';
      let dateISO = dtRaw;
      if (dtRaw.includes('-')) {
        const parts = dtRaw.split('-');
        if (parts.length === 3) {
          dateUS = `${parts[1]}/${parts[2]}/${parts[0]}`;
          dateISO = `${parts[0]}-${parts[1]}-${parts[2]}`;
        }
      } else {
        dateUS = dtRaw;
      }

      const amtNum = parseFloat((r['Amount'] || '0').replace(/[^0-9.]/g, ''));
      const amountStr = isNaN(amtNum) ? '0.00' : amtNum.toFixed(2);

      const stripeNum = parseFloat((r['Stripe Fee Amount'] || '0').replace(/[^0-9.]/g, '')) || 0;
      const feeNum = parseFloat((r['Fee'] || '0').replace(/[^0-9.]/g, '')) || 0;
      const totalFeeNum = stripeNum + feeNum;
      const netNum = parseFloat((r['Net Settlement'] || '0').replace(/[^0-9.]/g, '')) || (amtNum - totalFeeNum);

      const payoutDate = (r['Payout Datetime'] || '').split(' ')[0] || '';

      const firstName = (r['Donor First Name'] || '').trim();
      const lastName = (r['Donor Last Name'] || '').trim();
      const fullName = `${firstName} ${lastName}`.trim();

      return {
        id: r['Lineitem ID'] || r['Order Number'] || `item-${Math.random().toString(36).substring(2, 9)}`,
        orderNumber: r['Order Number'] || '',
        firstName,
        lastName,
        fullName,
        amount: amountStr,
        stripeFee: stripeNum.toFixed(2),
        actblueFee: feeNum.toFixed(2),
        totalFee: totalFeeNum.toFixed(2),
        netSettlement: netNum.toFixed(2),
        dateUS,
        dateISO,
        payoutDate,
        address: (r['Donor Address Line 1'] || '').trim(),
        city: (r['Donor City'] || '').trim(),
        state: (r['Donor State'] || '').trim(),
        zip: (r['Donor ZIP'] || '').trim(),
        occupation: (r['Donor Occupation'] || '').trim(),
        employer: (r['Donor Employer'] || '').trim(),
        email: (r['Donor Email'] || '').trim(),
        phone: (r['Donor Phone'] || '').trim()
      };
    });
}

/**
 * Groups contributions by payout settlement batch.
 */
export function computePayoutBatches(contributions: Contribution[]): PayoutBatch[] {
  const map: Record<string, { count: number; gross: number; stripe: number; fee: number; totalFee: number; net: number }> = {};

  for (const c of contributions) {
    const p = c.payoutDate || 'Unsettled';
    if (!map[p]) {
      map[p] = { count: 0, gross: 0, stripe: 0, fee: 0, totalFee: 0, net: 0 };
    }
    map[p].count++;
    map[p].gross += parseFloat(c.amount) || 0;
    map[p].stripe += parseFloat(c.stripeFee) || 0;
    map[p].fee += parseFloat(c.actblueFee) || 0;
    map[p].totalFee += parseFloat(c.totalFee) || 0;
    map[p].net += parseFloat(c.netSettlement) || 0;
  }

  return Object.entries(map).map(([payoutDate, d]) => ({
    payoutDate,
    count: d.count,
    gross: d.gross.toFixed(2),
    stripeFee: d.stripe.toFixed(2),
    actblueFee: d.fee.toFixed(2),
    totalFee: d.totalFee.toFixed(2),
    net: d.net.toFixed(2),
  }));
}
