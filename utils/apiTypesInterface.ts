export interface BankingDataInterface {
  id: number | null;
  date: string | null;
  merchant: string | null;
  status: string | null;
  amount: string | null;
  accounttype: string | null;
  user: string | null;
}

export interface UserContextInterface {
  user: { anonymous: boolean };
  kind: string;
  device?: object;
  location?: object;
  experience?: object;
  audience?: object;
}

export interface MigrationTransactionsInterface {
    origin: string;
    success: boolean;
    result: BankingDataInterface[];
  }
  