import { Reducer } from 'redux';

interface IInsertableReducer {
  reducer?: string;
}

export type InsertableReducer = Reducer<{}> & IInsertableReducer;
