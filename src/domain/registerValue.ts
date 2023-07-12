import {RegisterDate} from "./registerDate";
import {ValuesType} from "./valuesType";

export class RegisterValue{
  id?: number | bigint;
  value?: number;
  date?: Date;
  registerDate?: RegisterDate;
  valuesType?: ValuesType;
}
