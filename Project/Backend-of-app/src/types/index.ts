export interface User {
  id?: number;
  name: string;
  age: number;
  address: string;
  contact: string;
}

export type myerr = {
  message: string;
  stack?: string;
};

export interface Detail {
  id?: number;
  user_id: number;
  symptoms: string;
  treatment: string;
  image?: string;
}
