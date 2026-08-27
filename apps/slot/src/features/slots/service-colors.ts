const COLORS = [
  "#e0f2fe", // sky-100
  "#fce7f3", // pink-100
  "#d1fae5", // emerald-100
  "#fef3c7", // amber-100
  "#e0e7ff", // indigo-100
  "#ffe4e6", // rose-100
  "#ccfbf1", // teal-100
  "#fde68a", // amber-200
  "#ddd6fe", // violet-200
  "#fbcfe8", // pink-200
  "#bfdbfe", // blue-200
  "#a7f3d0", // emerald-200
  "#fed7aa", // orange-200
  "#c7d2fe", // indigo-200
  "#f5f5f4", // stone-100
];

export type ServiceColorMap = Record<string, string>;

export function buildServiceColorMap(
  serviceIds: string[],
  defaultServiceId?: string,
): ServiceColorMap {
  const sorted = [...serviceIds].sort((a, b) => {
    if (defaultServiceId) {
      if (a === defaultServiceId) return -1;
      if (b === defaultServiceId) return 1;
    }
    if (a.startsWith("service_default")) return -1;
    if (b.startsWith("service_default")) return 1;
    return a.localeCompare(b);
  });

  const map: ServiceColorMap = {};
  sorted.forEach((id, i) => {
    map[id] = COLORS[i % COLORS.length]!;
  });
  return map;
}
