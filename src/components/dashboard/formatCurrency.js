export default function formatCurrency(v) {
  if (v == null) return "€0";
  return `€${Number(v).toLocaleString()}`;
}
