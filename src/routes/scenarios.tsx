import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  SCENARIOS,
  type ScenarioId,
  getSeries,
  renewableShare,
  totalGeneration,
} from "@/lib/energy-data";
import { CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/scenarios")({
  head: () => ({
    meta: [
      { title: "ฉากทัศน์อนาคต — Post-Oil Futures Lab" },
      {
        name: "description",
        content:
          "สามฉากทัศน์การเปลี่ยนผ่านพลังงานของประเทศไทยถึงปี 2035 — Business as Usual, Energy Transition, Clean 100",
      },
    ],
  }),
  component: ScenariosPage,
});

const SCENARIO_COLOR: Record<ScenarioId, string> = {
  bau: "var(--energy-coal)",
  transition: "var(--energy-gas)",
  clean100: "var(--energy-bio)",
};

function ScenariosPage() {
  const [metric, setMetric] = useState<"renewable" | "co2" | "fossil">("renewable");

  const data = useMemo(() => {
    const years: Record<number, Record<string, number>> = {};
    for (const sc of SCENARIOS) {
      const series = getSeries(sc.id).filter((r) => r.year >= 2000 && r.year <= 2035);
      for (const r of series) {
        if (!years[r.year]) years[r.year] = { year: r.year };
        if (metric === "renewable") years[r.year][sc.id] = +renewableShare(r).toFixed(2);
        else if (metric === "fossil") years[r.year][sc.id] = +(100 - renewableShare(r)).toFixed(2);
        else years[r.year][sc.id] = r.co2_mt ?? 0;
      }
    }
    return Object.values(years).sort((a, b) => a.year - b.year);
  }, [metric]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-border pb-6">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--gov-navy)]">
          ภาพอนาคต / Future Scenarios
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
          เส้นทางการเปลี่ยนผ่านพลังงานของไทย ปี 2025–2035
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          ฉากทัศน์ทั้งสามนี้สร้างขึ้นด้วย scenario generation + system dynamics
          เพื่อแสดงผลลัพธ์ที่เป็นไปได้ภายใต้สมมุติฐานนโยบายและพลวัตทางเทคโนโลยีที่ต่างกัน
        </p>
      </div>

      {/* Scenario cards */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {SCENARIOS.map((s) => {
          const row2035 = getSeries(s.id).find((r) => r.year === 2035)!;
          const renew = renewableShare(row2035);
          const co2 = row2035.co2_mt ?? 0;
          return (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
              style={{ borderTop: `4px solid ${SCENARIO_COLOR[s.id]}` }}
            >
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                ฉากทัศน์
              </div>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">{s.label}</h2>
              <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Renewable @2035
                  </div>
                  <div className="font-display text-2xl font-semibold tabular-nums">
                    {renew.toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    CO₂ @2035
                  </div>
                  <div className="font-display text-2xl font-semibold tabular-nums">
                    {co2.toFixed(0)}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">Mt</span>
                  </div>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <Bullet on={s.id !== "bau"}>ขยายโครงข่ายพลังงานหมุนเวียน</Bullet>
                <Bullet on={s.id !== "bau"}>ภาษีคาร์บอน / Renewable Portfolio Standard</Bullet>
                <Bullet on={s.id === "clean100"}>เลิกใช้ถ่านหินและก๊าซ &gt; 90%</Bullet>
                <Bullet on={s.id === "clean100"}>ลดการนำเข้าน้ำมันลงเกินครึ่ง</Bullet>
              </ul>
            </div>
          );
        })}
      </div>

      {/* Comparison chart */}
      <div className="mt-10 rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              เปรียบเทียบ 3 ฉากทัศน์
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              เลือกตัวชี้วัดเพื่อเปรียบเทียบเส้นทางสู่ปี 2035
            </p>
          </div>
          <div className="inline-flex rounded-lg border border-border bg-background p-1">
            {(
              [
                { v: "renewable", l: "พลังงานสะอาด (%)" },
                { v: "fossil", l: "ฟอสซิล (%)" },
                { v: "co2", l: "CO₂ (Mt)" },
              ] as const
            ).map((m) => (
              <button
                key={m.v}
                onClick={() => setMetric(m.v)}
                data-active={metric === m.v}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all data-[active=true]:bg-[var(--gov-navy)] data-[active=true]:text-primary-foreground"
              >
                {m.l}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[420px]">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gov-line)" vertical={false} />
              <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickFormatter={(v) => (metric === "co2" ? `${v}` : `${v}%`)}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(label) => `ปี ค.ศ. ${label}`}
                formatter={(val, name) => {
                  const sc = SCENARIOS.find((s) => s.id === name);
                  const v = Number(val);
                  return [
                    metric === "co2" ? `${v.toFixed(1)} Mt` : `${v.toFixed(1)}%`,
                    sc?.label ?? String(name),
                  ];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(val) => SCENARIOS.find((s) => s.id === val)?.label ?? val}
              />
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
              {SCENARIOS.map((s) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.id}
                  stroke={SCENARIO_COLOR[s.id]}
                  strokeWidth={2.5}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-[var(--gov-navy)] p-8 text-primary-foreground">
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--gov-gold)]">
              บทสรุปจากโปสเตอร์ Track C
            </div>
            <h3 className="mt-2 font-display text-2xl font-semibold">
              หากใช้พลังงานสะอาด 100% ใน 10 ปีข้างหน้า จะเกิดอะไรขึ้น?
            </h3>
          </div>
          <div className="text-sm leading-relaxed text-primary-foreground/85">
            ราคาน้ำมันในไทยจะลดลงอย่างมีนัยสำคัญ จากอุปสงค์ในประเทศที่ลดลง
            ขณะที่ราคาน้ำมันโลกจะลดลงเพียงเล็กน้อย (ไทยเป็นผู้บริโภคขนาดเล็กในตลาดโลก)
            และต้นทุน LCOE ของพลังงานสะอาดจะต่ำกว่าฟอสซิลอย่างชัดเจน
          </div>
        </div>
      </div>
    </div>
  );
}

function Bullet({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      {on ? (
        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gov-navy)]" />
      ) : (
        <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
      )}
      <span className={on ? "text-foreground" : "line-through opacity-60"}>{children}</span>
    </li>
  );
}
