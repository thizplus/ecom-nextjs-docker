// types/categoryTypes.ts
import type { ObjectId } from "mongodb";

export type TypesCategory = {
  _id: ObjectId;
  id: number;
  __v: number;
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
