import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface TaxPayer {
  'tid' : string,
  'taxBracketCode' : string,
  'address' : string,
  'lastName' : string,
  'firstName' : string,
}
export interface _SERVICE {
  'addTaxPayer' : ActorMethod<[TaxPayer], undefined>,
  'deleteTaxPayer' : ActorMethod<[string], boolean>,
  'getAllTaxPayers' : ActorMethod<[], Array<TaxPayer>>,
  'searchTaxPayer' : ActorMethod<[string], [] | [TaxPayer]>,
  'updateTaxPayer' : ActorMethod<[TaxPayer], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
