export const idlFactory = ({ IDL }) => {
  const TaxPayer = IDL.Record({
    'tid' : IDL.Text,
    'taxBracketCode' : IDL.Text,
    'address' : IDL.Text,
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  return IDL.Service({
    'addTaxPayer' : IDL.Func([TaxPayer], [], []),
    'deleteTaxPayer' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getAllTaxPayers' : IDL.Func([], [IDL.Vec(TaxPayer)], ['query']),
    'searchTaxPayer' : IDL.Func([IDL.Text], [IDL.Opt(TaxPayer)], ['query']),
    'updateTaxPayer' : IDL.Func([TaxPayer], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
