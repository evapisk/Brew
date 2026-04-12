interface MatchStrength {
  label: string;
  color: string;
  reason: string;
}

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
  blue:    "bg-blue-100 text-blue-800 border-blue-200",
  violet:  "bg-violet-100 text-violet-800 border-violet-200",
  gray:    "bg-gray-100 text-gray-700 border-gray-200",
};

export function MatchStrengthBadge({ strength }: { strength: MatchStrength }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorMap[strength.color] ?? colorMap.gray}`}>
      {strength.label}
    </span>
  );
}
