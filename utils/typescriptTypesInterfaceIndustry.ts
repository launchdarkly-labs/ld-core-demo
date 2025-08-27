export type UpdateContextFunction = () => Promise<void>;
export type AddToCartFunction = (item: InventoryItem) => void;

export interface InventoryItem {
  id: string | number;
  item: string;
  cost: string;
  vendor: string;
  image?: any;
}

export interface BookedTrips  {
  airplane: string,
  depart: string,
  from: string,
  fromCity: string,
  id: number,
  to: string,
  toCity: string,
  type: string,
}

export interface UserDataType {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  ssn: string;
  phone: string;
  address: string;
  apt: string;
  zip: string;
  selectedServices: string[];
}

export interface WealthManagementGraphDataType {
  month: string;
  balance: number;
}