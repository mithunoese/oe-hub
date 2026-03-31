// Known OE customers and partners — contacts at these firms should be flagged
// Source: OE LinkedIn posts, internal knowledge, Salesforce
// Update this list periodically from Workbench SOQL exports

export const OE_CUSTOMER_FIRMS: string[] = [
  // Confirmed from OE LinkedIn posts & public references
  'Salesforce',
  'Computershare',
  'AALAS',
  // Add more as you discover them from Workbench/Salesforce
  // To bulk-add: run SOQL in Workbench →
  //   SELECT Account.Name FROM Order WHERE End_Date__c >= 2025-01-01 GROUP BY Account.Name
  // Then paste the account names here
];

// Normalize for fuzzy matching
export function isOeCustomer(firmName: string): boolean {
  const norm = firmName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return OE_CUSTOMER_FIRMS.some(c => {
    const cn = c.toLowerCase().replace(/[^a-z0-9]/g, '');
    return norm.includes(cn) || cn.includes(norm);
  });
}
