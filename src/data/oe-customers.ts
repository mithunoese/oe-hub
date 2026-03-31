// Known OE customers and partners — contacts at these firms should be flagged
// Source: OE LinkedIn posts, weekly reports, internal knowledge
// Update this list periodically from Workbench SOQL exports
//
// To bulk-add: run SOQL in Workbench →
//   SELECT Account.Name FROM Order WHERE End_Date__c >= 2025-01-01 GROUP BY Account.Name
// Then paste the account names here

export const OE_CUSTOMER_FIRMS: string[] = [
  // Confirmed from OE LinkedIn (Mark Loehr managed their earnings call)
  'Salesforce',

  // Strategic alliance — podcast series, joint go-to-market
  'Computershare',
  'Georgeson', // Computershare subsidiary

  // Confirmed client — Chris Lyons testimonial on OE LinkedIn
  'AALAS',

  // Confirmed client — OE presented award to them at IR Society dinner
  'Volex',

  // Confirmed partner — Productive Companies post mentions OE partnership
  'MWAA',
  'Productive Companies',

  // Confirmed from GCS pipeline review (Week 6 report)
  'EPAM',          // Jules' ~$165K engagement
  'Delivery Hero', // Christian's deal — 15th anniversary summit
  'Glencore',      // Jamie's deal
  'Lenovo',        // Jamie's deal
  'Global Payments', // Garrett's deal with OE Meet
  'Genius Sports',   // CJ's deal
  'Albemarle',       // Kaylee's deal
  'Altria',          // Jacob's 10-month close
  'HubSpot',         // CJ — contract out
  'Klaviyo',         // CJ — $13K imminent
  'Danaher',         // Kaylee — potential OE Meet client
  'GSK',             // Peter's deal
  'BioMarin',        // Kaylee — Grail ~$15K (note: also in ASCO pipeline)

  // Confirmed existing integrations (from Ali 1:1, Week 6)
  'Barclays',
  'BTS',             // Barclays subsidiary
  'Citi',
  'Citigroup',
  'Jefferies',
  'BNP Paribas',
  'NYSE',
  'New York Stock Exchange',

  // Zoom — OE is their preferred partner (not a prospect)
  'Zoom',
];

// Normalize for fuzzy matching
export function isOeCustomer(firmName: string): boolean {
  const norm = firmName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return OE_CUSTOMER_FIRMS.some(c => {
    const cn = c.toLowerCase().replace(/[^a-z0-9]/g, '');
    return norm.includes(cn) || cn.includes(norm);
  });
}
