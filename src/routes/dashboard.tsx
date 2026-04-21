import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Info } from "lucide-react";
import {
  EnergyMixChart,
  RenewableShareChart,
  CO2Chart,
  SourceToggleRow,
  StatTile,
  useEnergyToggles,
  rowAt,
} from "@/components/charts";
import {
  type ScenarioId,
  SCENARIOS,
  ENERGY_LABELS_TH,
  type EnergySource,
  totalGeneration,
  renewableShare,
  fossilShare,
  getSeries,
} from "@/lib/energy-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "แดชบอร์ดข้อมูลพลังงาน — Post-Oil Futures Lab" },
      {
        name: "description",
        content:
          "สำรวจ energy mix ของประเทศไทยตั้งแต่ปี 1900 ถึง 2035 พร้อมตัวชี้วัด CO₂ และสัดส่วนพลังงานสะอาด",
      },
      { property: "og:title", content: "แดชบอร์ดข้อมูลพลังงานไทย 1900–2035" },
      {
        property: "og:description",
        content: "Interactive dashboard บน DOEB / EIA / OWID / Ember",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [scenario, setScenario] = useState<ScenarioId>("transition");
  const [startYear, setStartYear] = useState(1971);
  const [endYear, setEndYear] = useState(2035);
  const [mode, setMode] = useState<"stacked" | "share">("stacked");
  const { visible, setVisible } = useEnergyToggles();

  const focusYear = endYear;
  const focusRow = rowAt(scenario, focusYear);
  const baselineRow = rowAt(scenario, 2000);

  const csvHref = useMemo(() => {
    const rows = getSeries(scenario).filter(
      (r) => r.year >= startYear && r.year <= endYear,
    );
    const headers = [
      "year","coal","oil","gas","hydro","solar","wind","bio","co2_mt","oil_demand_kbd",
    ];
    const body = rows
      .map((r) =>
        headers
          .map((h) => (r as unknown as Record<string, number>)[h] ?? "")
          .join(","),
      )
      .join("\n");
    const csv = headers.join(",") + "\n" + body;
    return "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  }, [scenario, startYear, endYear]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--gov-navy)]">
          <span>แดชบอร์ดข้อมูล</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Energy Mix Explorer</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
          ภาพรวมการผลิตและการใช้พลังงานของประเทศไทย
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          ข้อมูลย้อนหลัง 125 ปี (1900–2024) บูรณาการจาก OWID / EIA / Ember / DOEB
          และฉากทัศน์ 10 ปีข้างหน้า (2025–2035) สร้างจาก scenario modeling
        </p>
      </div>

      {/* Controls */}
      <div className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-5 shadow-card lg:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          {/* Scenario tabs */}
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              ฉากทัศน์อนาคต (2025–2035)
            </div>
            <div className="mt-2 inline-flex flex-wrap rounded-lg border border-border bg-background p-1">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  data-active={scenario === s.id}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all data-[active=true]:bg-[var(--gov-navy)] data-[active=true]:text-primary-foreground"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Year sliders */}
          <div className="grid gap-4 sm:grid-cols-2">
            <YearSlider
              label="ปีเริ่มต้น"
              min={1900}
              max={endYear - 1}
              value={startYear}
              onChange={setStartYear}
            />
            <YearSlider
              label="ปีสิ้นสุด"
              min={Math.max(startYear + 1, 1901)}
              max={2035}
              value={endYear}
              onChange={setEndYear}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              มุมมอง
            </span>
            <div className="inline-flex rounded-lg border border-border bg-background p-1">
              <button
                onClick={() => setMode("stacked")}
                data-active={mode === "stacked"}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all data-[active=true]:bg-[var(--gov-navy)] data-[active=true]:text-primary-foreground"
              >
                ปริมาณ (TWh)
              </button>
              <button
                onClick={() => setMode("share")}
                data-active={mode === "share"}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all data-[active=true]:bg-[var(--gov-navy)] data-[active=true]:text-primary-foreground"
              >
                สัดส่วน (%)
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <a
            href={csvHref}
            download={`thailand-energy-${scenario}-${startYear}-${endYear}.csv`}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--gov-navy)]"
          >
            <Download className="h-4 w-4" /> ดาวน์โหลด CSV
          </a>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label={`การผลิตไฟฟ้า ปี ${focusYear}`}
          value={focusRow ? totalGeneration(focusRow).toFixed(0) : "–"}
          unit="TWh"
          hint={baselineRow ? `เทียบปี 2000: ${totalGeneration(baselineRow).toFixed(0)} TWh` : ""}
          trend="up"
        />
        <StatTile
          label="สัดส่วนพลังงานสะอาด"
          value={focusRow ? renewableShare(focusRow).toFixed(1) + "%" : "–"}
          hint="Hydro + Solar + Wind + Bio"
          trend="up"
        />
        <StatTile
          label="สัดส่วนฟอสซิล"
          value={focusRow ? fossilShare(focusRow).toFixed(1) + "%" : "–"}
          hint="Coal + Oil + Gas"
          trend="down"
        />
        <StatTile
          label={`CO₂ ภาคพลังงาน ปี ${focusYear}`}
          value={focusRow?.co2_mt?.toFixed(0) ?? "–"}
          unit="ล้านตัน"
          hint={`อุปสงค์น้ำมัน ${focusRow?.oil_demand_kbd ?? "–"} kbd`}
        />
      </div>

      {/* Main chart */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Energy Mix การผลิตไฟฟ้า ปี {startYear}–{endYear}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              แถบสีอ่อนหลังปี 2024 = ช่วงคาดการณ์ภายใต้ฉากทัศน์ &ldquo;
              {SCENARIOS.find((s) => s.id === scenario)?.label}&rdquo;
            </p>
          </div>
          <SourceToggleRow visible={visible} onChange={setVisible} />
        </div>
        <EnergyMixChart
          scenario={scenario}
          startYear={startYear}
          endYear={endYear}
          visible={visible}
          mode={mode}
        />
      </div>

      {/* Twin charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-lg font-semibold text-foreground">
            สัดส่วนพลังงานสะอาด vs ฟอสซิล
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            อ้างอิง Ember Yearly Electricity Data + ฉากทัศน์ {SCENARIOS.find((s) => s.id === scenario)?.label}
          </p>
          <div className="mt-3">
            <RenewableShareChart
              scenario={scenario}
              startYear={Math.max(startYear, 1971)}
              endYear={endYear}
            />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-lg font-semibold text-foreground">
            การปล่อย CO₂ จากภาคพลังงาน
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            หน่วย: ล้านตัน CO₂ต่อปี (อ้างอิง OWID / EIA + factor การปล่อยมาตรฐาน)
          </p>
          <div className="mt-3">
            <CO2Chart
              scenario={scenario}
              startYear={Math.max(startYear, 1971)}
              endYear={endYear}
            />
          </div>
        </div>
      </div>

      {/* Legend / methodology */}
      <div className="mt-6 rounded-xl border border-dashed border-border bg-secondary/50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gov-navy)]" />
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">หมายเหตุระเบียบวิธี:</strong>{" "}
            ค่าระหว่างปี 1900–1970 อ้างอิงจาก OWID historical reconstruction
            (พลังงานชีวมวลดั้งเดิมเป็นองค์ประกอบหลัก)
            ค่า 1971–2024 บูรณาการจาก EIA, OWID, Ember Electricity Data และ DOEB Open Data
            ค่า 2025–2035 คำนวณด้วย scenario projection โดยปรับ fossil share และ renewable share
            ตามนโยบายในแต่ละฉากทัศน์ พร้อมประมาณการอุปสงค์ไฟฟ้าเติบโตปีละ ~1.8%
            ตัวเลข CO₂ ใช้ emission factor มาตรฐาน (ถ่านหิน 0.95, ก๊าซ 0.42, น้ำมัน 0.78 Mt/TWh)
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(ENERGY_LABELS_TH) as EnergySource[])
                .filter((k) => k !== "nuclear")
                .map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: `var(--energy-${k})` }}
                    />
                    {ENERGY_LABELS_TH[k]}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function YearSlider({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="font-display text-lg font-semibold tabular-nums text-foreground">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-1.5 w-full appearance-none rounded-full bg-secondary accent-[var(--gov-navy)]"
      />
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
