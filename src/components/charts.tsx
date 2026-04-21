import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import {
  ENERGY_LABELS_TH,
  ENERGY_COLOR_VAR,
  type EnergySource,
  type ScenarioId,
  type YearRow,
  getSeries,
  renewableShare,
  totalGeneration,
} from "@/lib/energy-data";

interface EnergyMixChartProps {
  scenario: ScenarioId;
  startYear: number;
  endYear: number;
  visible: Record<EnergySource, boolean>;
  mode: "stacked" | "share";
}

const STACK_ORDER: EnergySource[] = [
  "coal",
  "oil",
  "gas",
  "hydro",
  "bio",
  "wind",
  "solar",
];

export function EnergyMixChart({
  scenario,
  startYear,
  endYear,
  visible,
  mode,
}: EnergyMixChartProps) {
  const data = useMemo<Record<string, number>[]>(() => {
    const rows = getSeries(scenario).filter(
      (r) => r.year >= startYear && r.year <= endYear,
    );
    if (mode === "share") {
      return rows.map((r) => {
        const total = totalGeneration(r) || 1;
        const out: Record<string, number> = { year: r.year };
        for (const src of STACK_ORDER) {
          out[src] = +(((r[src] as number) / total) * 100).toFixed(2);
        }
        return out;
      });
    }
    return rows.map((r) => ({
      year: r.year,
      coal: r.coal,
      oil: r.oil,
      gas: r.gas,
      hydro: r.hydro,
      solar: r.solar,
      wind: r.wind,
      bio: r.bio,
      nuclear: r.nuclear,
    }));
  }, [scenario, startYear, endYear, mode]);

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--gov-line)" vertical={false} />
          <XAxis
            dataKey="year"
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickMargin={8}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickFormatter={(v) => (mode === "share" ? `${v}%` : `${v}`)}
            label={{
              value: mode === "share" ? "สัดส่วน (%)" : "TWh",
              angle: -90,
              position: "insideLeft",
              style: { fill: "var(--muted-foreground)", fontSize: 11 },
              offset: 18,
            }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(label) => `ปี ค.ศ. ${label}`}
            formatter={(val: number, name: string) => [
              mode === "share" ? `${val.toFixed(1)}%` : `${val.toFixed(1)} TWh`,
              ENERGY_LABELS_TH[name as EnergySource] ?? name,
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(val) => ENERGY_LABELS_TH[val as EnergySource] ?? val}
          />
          {endYear > 2024 && startYear < 2025 && (
            <ReferenceArea
              x1={2025}
              x2={Math.min(endYear, 2035)}
              fill="var(--gov-gold)"
              fillOpacity={0.07}
              ifOverflow="hidden"
            />
          )}
          {endYear >= 2024 && startYear <= 2024 && (
            <ReferenceLine
              x={2024}
              stroke="var(--gov-navy)"
              strokeDasharray="4 4"
              label={{
                value: "ปัจจุบัน",
                position: "top",
                fill: "var(--gov-navy)",
                fontSize: 10,
              }}
            />
          )}
          {STACK_ORDER.filter((s) => visible[s]).map((src) => (
            <Area
              key={src}
              type="monotone"
              dataKey={src}
              stackId="1"
              stroke={ENERGY_COLOR_VAR[src]}
              fill={ENERGY_COLOR_VAR[src]}
              fillOpacity={0.85}
              strokeWidth={1}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface RenewableShareChartProps {
  scenario: ScenarioId;
  startYear: number;
  endYear: number;
}

export function RenewableShareChart({
  scenario,
  startYear,
  endYear,
}: RenewableShareChartProps) {
  const data = useMemo(() => {
    return getSeries(scenario)
      .filter((r) => r.year >= startYear && r.year <= endYear)
      .map((r) => ({
        year: r.year,
        renewable: +renewableShare(r).toFixed(2),
        fossil: +(100 - renewableShare(r)).toFixed(2),
      }));
  }, [scenario, startYear, endYear]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--gov-line)" vertical={false} />
          <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(label) => `ปี ค.ศ. ${label}`}
            formatter={(val: number) => `${val.toFixed(1)}%`}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {endYear >= 2024 && startYear <= 2024 && (
            <ReferenceLine x={2024} stroke="var(--gov-navy)" strokeDasharray="4 4" />
          )}
          <Line
            type="monotone"
            dataKey="renewable"
            name="พลังงานสะอาด"
            stroke="var(--energy-bio)"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="fossil"
            name="ฟอสซิล"
            stroke="var(--energy-coal)"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CO2ChartProps {
  scenario: ScenarioId;
  startYear: number;
  endYear: number;
}

export function CO2Chart({ scenario, startYear, endYear }: CO2ChartProps) {
  const data = useMemo(
    () =>
      getSeries(scenario)
        .filter((r) => r.year >= startYear && r.year <= endYear)
        .map((r) => ({ year: r.year, co2: r.co2_mt ?? 0 })),
    [scenario, startYear, endYear],
  );
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="co2grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--energy-coal)" stopOpacity={0.7} />
              <stop offset="100%" stopColor="var(--energy-coal)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--gov-line)" vertical={false} />
          <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(label) => `ปี ค.ศ. ${label}`}
            formatter={(val: number) => [`${val.toFixed(1)} ล้านตัน`, "CO₂"]}
          />
          {endYear >= 2024 && startYear <= 2024 && (
            <ReferenceLine x={2024} stroke="var(--gov-navy)" strokeDasharray="4 4" />
          )}
          <Area
            type="monotone"
            dataKey="co2"
            stroke="var(--energy-coal)"
            fill="url(#co2grad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function useEnergyToggles() {
  const [visible, setVisible] = useState<Record<EnergySource, boolean>>({
    coal: true,
    oil: true,
    gas: true,
    hydro: true,
    solar: true,
    wind: true,
    bio: true,
    nuclear: false,
  });
  return { visible, setVisible };
}

export function SourceToggleRow({
  visible,
  onChange,
}: {
  visible: Record<EnergySource, boolean>;
  onChange: (next: Record<EnergySource, boolean>) => void;
}) {
  const items: EnergySource[] = ["coal", "oil", "gas", "hydro", "bio", "wind", "solar"];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((src) => (
        <button
          key={src}
          onClick={() => onChange({ ...visible, [src]: !visible[src] })}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-all hover:border-[var(--gov-navy)] data-[on=false]:opacity-40"
          data-on={visible[src]}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: ENERGY_COLOR_VAR[src] }}
          />
          {ENERGY_LABELS_TH[src]}
        </button>
      ))}
    </div>
  );
}

export function StatTile({
  label,
  value,
  unit,
  hint,
  trend,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  trend?: "up" | "down" | "flat";
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold text-foreground tabular-nums">
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {hint && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          {trend === "up" && <span className="text-emerald-600">↗</span>}
          {trend === "down" && <span className="text-rose-600">↘</span>}
          {trend === "flat" && <span>→</span>}
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
}

export function rowAt(scenario: ScenarioId, year: number): YearRow | undefined {
  return getSeries(scenario).find((r) => r.year === year);
}
