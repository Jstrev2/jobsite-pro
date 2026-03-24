export const JOB_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  scheduled: { label: "Scheduled", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" },
  in_progress: { label: "In Progress", color: "#eab308", bg: "rgba(234, 179, 8, 0.15)" },
  complete: { label: "Complete", color: "#22c55e", bg: "rgba(34, 197, 94, 0.15)" },
  invoiced: { label: "Invoiced", color: "#a855f7", bg: "rgba(168, 85, 247, 0.15)" },
  paid: { label: "Paid", color: "#14b8a6", bg: "rgba(20, 184, 166, 0.15)" },
};

export const JOB_TYPES: Record<string, { label: string; icon: string }> = {
  electrical: { label: "Electrical", icon: "⚡" },
  contractor: { label: "Contractor", icon: "🔨" },
  service_call: { label: "Service Call", icon: "🔧" },
  inspection: { label: "Inspection", icon: "📋" },
  other: { label: "Other", icon: "📦" },
};

export const COMMON_ELECTRICAL_TASKS = [
  { name: "Panel Upgrade (100A → 200A)", laborHrs: 8, materialsCost: 800, laborRate: 85 },
  { name: "Outlet Install (standard)", laborHrs: 0.75, materialsCost: 15, laborRate: 85 },
  { name: "Outlet Install (GFCI)", laborHrs: 1, materialsCost: 25, laborRate: 85 },
  { name: "Light Fixture Install", laborHrs: 1, materialsCost: 0, laborRate: 85 },
  { name: "Ceiling Fan Install", laborHrs: 1.5, materialsCost: 0, laborRate: 85 },
  { name: "Circuit Breaker Replace", laborHrs: 1, materialsCost: 30, laborRate: 85 },
  { name: "New Circuit Run", laborHrs: 3, materialsCost: 75, laborRate: 85 },
  { name: "Whole House Rewire", laborHrs: 40, materialsCost: 2500, laborRate: 85 },
  { name: "EV Charger Install (Level 2)", laborHrs: 4, materialsCost: 200, laborRate: 85 },
  { name: "Smoke Detector Install", laborHrs: 0.5, materialsCost: 35, laborRate: 85 },
  { name: "Recessed Lighting (per light)", laborHrs: 1.5, materialsCost: 30, laborRate: 85 },
  { name: "Electrical Inspection", laborHrs: 2, materialsCost: 0, laborRate: 85 },
  { name: "Troubleshooting / Diagnosis", laborHrs: 1, materialsCost: 0, laborRate: 95 },
];

export const COMMON_CONTRACTOR_TASKS = [
  { name: "Drywall Repair (small)", laborHrs: 2, materialsCost: 25, laborRate: 65 },
  { name: "Drywall Hang (per sheet)", laborHrs: 1, materialsCost: 15, laborRate: 65 },
  { name: "Framing (per wall)", laborHrs: 4, materialsCost: 150, laborRate: 65 },
  { name: "Door Install (interior)", laborHrs: 2, materialsCost: 0, laborRate: 65 },
  { name: "Door Install (exterior)", laborHrs: 3, materialsCost: 0, laborRate: 65 },
  { name: "Trim / Baseboard (per room)", laborHrs: 3, materialsCost: 80, laborRate: 65 },
  { name: "Deck Repair", laborHrs: 8, materialsCost: 300, laborRate: 65 },
  { name: "Fence Repair (per section)", laborHrs: 2, materialsCost: 75, laborRate: 65 },
  { name: "Tile Install (per sqft)", laborHrs: 0.15, materialsCost: 3, laborRate: 65 },
  { name: "Painting (per room)", laborHrs: 4, materialsCost: 50, laborRate: 55 },
  { name: "Demolition (per room)", laborHrs: 4, materialsCost: 0, laborRate: 55 },
  { name: "General Labor (per hour)", laborHrs: 1, materialsCost: 0, laborRate: 55 },
];

export const WIRE_GAUGE_CHART = [
  { amps: 15, gauge: "14 AWG", breaker: "15A", commonUse: "Lighting, general outlets" },
  { amps: 20, gauge: "12 AWG", breaker: "20A", commonUse: "Kitchen, bathroom, garage outlets" },
  { amps: 30, gauge: "10 AWG", breaker: "30A", commonUse: "Dryer, water heater" },
  { amps: 40, gauge: "8 AWG", breaker: "40A", commonUse: "Range, cooktop" },
  { amps: 50, gauge: "6 AWG", breaker: "50A", commonUse: "Range, EV charger" },
  { amps: 60, gauge: "4 AWG", breaker: "60A", commonUse: "Sub-panel" },
  { amps: 100, gauge: "1 AWG", breaker: "100A", commonUse: "Sub-panel, service entrance" },
  { amps: 200, gauge: "2/0 AWG", breaker: "200A", commonUse: "Main service entrance" },
];
