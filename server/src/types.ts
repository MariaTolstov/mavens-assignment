export enum Gender {
  Male = 'male',
  Female = 'female',
}

export interface IGenderResponseData {
  gender: Gender;
  name: string;
  probability: number;
}

export interface IExtraUserData {
  cell: string;
  dob: { date: string; age: number };
  email: string;
  nat: string;
  phone: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export interface IUser {
  name: string;
  score: number;
  gender?: Gender;
  metadata?: IExtraUserData;
}
