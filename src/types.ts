export interface Contribution {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  amount: string;
  stripeFee: string;
  actblueFee: string;
  totalFee: string;
  netSettlement: string;
  dateUS: string;   // MM/DD/YYYY
  dateISO: string;  // YYYY-MM-DD
  payoutDate: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  occupation: string;
  employer: string;
  email: string;
  phone: string;
}

export interface PayoutBatch {
  payoutDate: string;
  count: number;
  gross: string;
  stripeFee: string;
  actblueFee: string;
  totalFee: string;
  net: string;
}

export type NetFileScreen = 
  | 'SelectEntity' 
  | 'PeopleAdd' 
  | 'OrgAdd' 
  | 'TransactionAddContribution' 
  | 'TransactionAddDisbursement' 
  | 'Unknown';

export interface EnteredStatusMap {
  [id: string]: boolean;
}
