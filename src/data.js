export const TIERS = [
  { id: 'table',   name: 'Table',     color: 'var(--t-table)',   hex: '#a3acb8', w: 600 },
  { id: 'village', name: 'Village',   color: 'var(--t-village)', hex: '#5e98d9', w: 220 },
  { id: 'premier', name: 'Premier',   color: 'var(--t-premier)', hex: '#4b69ff', w: 100 },
  { id: 'grand',   name: 'Grand',     color: 'var(--t-grand)',   hex: '#8847ff', w: 50 },
  { id: 'reserve', name: 'Reserve',   color: 'var(--t-reserve)', hex: '#d32ce6', w: 20 },
  { id: 'cult',    name: 'Cult',      color: 'var(--t-cult)',    hex: '#eb4b4b', w: 8 },
  { id: 'legend',  name: '★ Legendary', color: 'var(--t-legend)', hex: '#e4ae39', w: 2 },
];
export const T = Object.fromEntries(TIERS.map((t, i) => [t.id, { ...t, i }]));
export const TOTAL_W = TIERS.reduce((s, t) => s + t.w, 0);

// item: [name, detail, type, tier, value, shape?]
export const CRATES = [
  {
    id: 'house', name: 'House Party', price: 15, band: '#5e98d9', wood: ['#b07a46', '#7a4b28'],
    desc: 'Crowd-pleasers for a Tuesday. Small chance of a vintage magnum.',
    items: [
      ['Vino Rosso della Casa', 'Italy · NV', 'red', 'table', 6],
      ['Pinot Grigio “Breezy”', 'Veneto · 2024', 'white', 'table', 7],
      ['Pink Flamingo Rosé', 'Provence · 2024', 'rose', 'table', 8],
      ['Côtes du Rhône Villages', 'Rhône · 2022', 'red', 'village', 14],
      ['Rioja Crianza', 'Spain · 2020', 'red', 'village', 16],
      ['Chablis', 'Burgundy · 2022', 'white', 'premier', 24, 'burg'],
      ['Barbera d’Alba', 'Piedmont · 2021', 'red', 'premier', 26, 'burg'],
      ['Brunello di Montalcino', 'Tuscany · 2018', 'red', 'grand', 55],
      ['Champagne Brut Réserve', 'Champagne · NV', 'sparkling', 'reserve', 70],
      ['Barolo Riserva', 'Piedmont · 2013', 'red', 'cult', 140, 'burg'],
      ['Vintage Champagne Magnum', 'Champagne · 2008', 'sparkling', 'legend', 420],
    ],
  },
  {
    id: 'bubbles', name: 'Bubbles Box', price: 39, band: '#d32ce6', wood: ['#c9a273', '#8a6540'], hot: true,
    desc: 'Sparkling only. Cava to prestige cuvée, all the way up to a jeroboam.',
    items: [
      ['Cava Brut', 'Penedès · NV', 'sparkling', 'table', 9],
      ['Prosecco DOC', 'Veneto · NV', 'sparkling', 'table', 10],
      ['Crémant de Loire', 'Loire · NV', 'sparkling', 'village', 18],
      ['Crémant d’Alsace Rosé', 'Alsace · NV', 'rosesp', 'village', 20],
      ['Champagne Brut', 'Champagne · NV', 'sparkling', 'premier', 42],
      ['Franciacorta Satèn', 'Lombardy · 2019', 'sparkling', 'premier', 38],
      ['Blanc de Blancs', 'Côte des Blancs · 2015', 'sparkling', 'grand', 95],
      ['Grower Extra Brut', 'Montagne de Reims · 2012', 'sparkling', 'reserve', 160],
      ['Prestige Cuvée', 'Champagne · 2012', 'sparkling', 'cult', 260],
      ['Prestige Rosé Jeroboam', 'Champagne · 2002', 'rosesp', 'legend', 3200],
    ],
  },
  {
    id: 'bordeaux', name: 'Bordeaux Vault', price: 69, band: '#8e1b33', wood: ['#7b4a2a', '#4a2a16'],
    desc: 'Left bank, right bank, and a 1er Grand Cru imperial hiding in the straw.',
    items: [
      ['Bordeaux Supérieur', 'Bordeaux · 2021', 'red', 'table', 14],
      ['Entre-Deux-Mers', 'Bordeaux · 2023', 'white', 'table', 12],
      ['Médoc Cru Bourgeois', 'Médoc · 2019', 'red', 'village', 32],
      ['Graves Blanc', 'Graves · 2021', 'white', 'village', 30],
      ['Saint-Émilion Grand Cru', 'Right bank · 2016', 'red', 'premier', 75],
      ['Pessac-Léognan Rouge', 'Graves · 2015', 'red', 'premier', 85],
      ['Pauillac Second Wine', 'Pauillac · 2016', 'red', 'grand', 160],
      ['Margaux 3ème Cru', 'Margaux · 2010', 'red', 'reserve', 280],
      ['Pomerol “Le Petit Trésor”', 'Pomerol · 2009', 'red', 'cult', 900],
      ['Pauillac 1er Cru Imperial', 'Pauillac · 2000', 'red', 'legend', 6800],
    ],
  },
  {
    id: 'burgundy', name: 'Burgundy Heist', price: 129, band: '#e4ae39', wood: ['#5c3a24', '#2f1c10'], shape: 'burg',
    desc: 'High stakes Pinot and Chardonnay. The top drop costs more than your car.',
    items: [
      ['Bourgogne Rouge', 'Côte d’Or · 2022', 'red', 'table', 22],
      ['Mâcon-Villages', 'Mâconnais · 2022', 'white', 'table', 18],
      ['Gevrey-Chambertin', 'Côte de Nuits · 2020', 'red', 'village', 70],
      ['Meursault', 'Côte de Beaune · 2020', 'white', 'village', 80],
      ['Volnay 1er Cru', 'Côte de Beaune · 2017', 'red', 'premier', 120],
      ['Puligny-Montrachet 1er Cru', 'Côte de Beaune · 2018', 'white', 'premier', 150],
      ['Clos de Vougeot Grand Cru', 'Côte de Nuits · 2015', 'red', 'grand', 320],
      ['Corton-Charlemagne Grand Cru', 'Côte de Beaune · 2014', 'white', 'reserve', 480],
      ['Musigny Grand Cru', 'Côte de Nuits · 2010', 'red', 'cult', 1900],
      ['Vosne-Romanée Grand Cru', 'Côte de Nuits · 1990', 'red', 'legend', 14500],
    ],
  },
].map(c => ({ ...c, items: c.items.map(([name, detail, type, tier, value, shape]) => ({
  name, detail, type, tier, value, crate: c.id,
  shape: shape || (type === 'sparkling' || type === 'rosesp' ? 'champ' : type === 'white' ? 'burg' : c.shape || 'bdx'),
})) }));
