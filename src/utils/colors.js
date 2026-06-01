// A handcrafted palette of distinct, accessible colors
const PALETTE = [
  { bg: '#e8635a', light: '#fde8e7', text: '#ffffff' }, // coral red
  { bg: '#4a90d9', light: '#deeef9', text: '#ffffff' }, // sky blue
  { bg: '#5cb85c', light: '#dff0df', text: '#ffffff' }, // forest green
  { bg: '#f0a500', light: '#fef3d0', text: '#ffffff' }, // amber
  { bg: '#9b59b6', light: '#eedff5', text: '#ffffff' }, // violet
  { bg: '#1abc9c', light: '#d1f5ee', text: '#ffffff' }, // teal
  { bg: '#e67e22', light: '#fdebd0', text: '#ffffff' }, // orange
  { bg: '#2980b9', light: '#d6eaf8', text: '#ffffff' }, // deep blue
  { bg: '#c0392b', light: '#fadbd8', text: '#ffffff' }, // crimson
  { bg: '#27ae60', light: '#d5f5e3', text: '#ffffff' }, // emerald
  { bg: '#8e44ad', light: '#ebdef0', text: '#ffffff' }, // purple
  { bg: '#16a085', light: '#d0ece7', text: '#ffffff' }, // green sea
  { bg: '#d35400', light: '#fae5d3', text: '#ffffff' }, // pumpkin
  { bg: '#2c3e50', light: '#d6dbdf', text: '#ffffff' }, // dark slate
  { bg: '#c0392b', light: '#fadbd8', text: '#ffffff' }, // pomegranate
  { bg: '#f39c12', light: '#fef9e7', text: '#ffffff' }, // sunflower
];

export function getColorForIndex(index) {
  return PALETTE[index % PALETTE.length];
}

export function getColorForPerson(people, personId) {
  const idx = people.findIndex(p => p.id === personId);
  return idx >= 0 ? getColorForIndex(idx) : PALETTE[0];
}
