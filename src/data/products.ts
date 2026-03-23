// Products are now stored in the Supabase database.
// Use the useProducts() hook from @/hooks/useProducts to fetch them.

export const PRODUCT_CATEGORIES = [
  'Mööbel',
  'Valgustid',
  'Varia',
  'Soodus -%',
];

export const categories = [
  'Kõik',
  ...PRODUCT_CATEGORIES,
];
