// Thailand energy generation & consumption data (1900–2035)
// Sources: OWID Energy Data, EIA Open Data, Ember Yearly Electricity Data, DOEB Open Data
// Note: ค่าก่อนปี 1971 อ้างอิงจาก OWID historical reconstruction (ส่วนใหญ่เป็นชีวมวลแบบดั้งเดิม)
// ค่าปี 1971–2024 จาก OWID/EIA/Ember consolidated dataset
// ค่าปี 2025–2035 เป็น scenario projection 3 แบบ

export type EnergySource =
  | "coal"
  | "oil"
  | "gas"
  | "hydro"
  | "solar"
  | "wind"
  | "bio"
  | "nuclear";

export interface YearRow {
  year: number;
  // หน่วย: TWh (พลังงานไฟฟ้าผลิตได้ในปีนั้น)
  coal: number;
  oil: number;
  gas: number;
  hydro: number;
  solar: number;
  wind: number;
  bio: number;
  nuclear: number;
  // ตัวเลขเสริม
  co2_mt?: number; // ล้านตัน CO2 จากภาคพลังงาน
  oil_demand_kbd?: number; // อุปสงค์น้ำมันพันบาร์เรล/วัน
  population_m?: number;
}

export const ENERGY_LABELS_TH: Record<EnergySource, string> = {
  coal: "ถ่านหิน",
  oil: "น้ำมัน",
  gas: "ก๊าซธรรมชาติ",
  hydro: "พลังน้ำ",
  solar: "พลังงานแสงอาทิตย์",
  wind: "พลังงานลม",
  bio: "พลังงานชีวภาพ",
  nuclear: "นิวเคลียร์",
};

export const ENERGY_COLOR_VAR: Record<EnergySource, string> = {
  coal: "var(--energy-coal)",
  oil: "var(--energy-oil)",
  gas: "var(--energy-gas)",
  hydro: "var(--energy-hydro)",
  solar: "var(--energy-solar)",
  wind: "var(--energy-wind)",
  bio: "var(--energy-bio)",
  nuclear: "var(--energy-nuclear)",
};

export const RENEWABLE_SOURCES: EnergySource[] = ["hydro", "solar", "wind", "bio"];
export const FOSSIL_SOURCES: EnergySource[] = ["coal", "oil", "gas"];

// ---------------------------------------------------------------
// Historical data (1900–2024)
// ---------------------------------------------------------------
// ใช้การ interpolation จากจุดอ้างอิงตามแหล่งข้อมูลจริง
// 1900–1970: ระบบไฟฟ้าไทยยังเล็กมาก ใช้ชีวมวลดั้งเดิมเป็นหลัก
// 1971+: เริ่มมีข้อมูลจาก EIA / OWID / Ember

const ANCHOR_POINTS: Partial<YearRow>[] = [
  { year: 1900, coal: 0, oil: 0, gas: 0, hydro: 0, solar: 0, wind: 0, bio: 0.5, nuclear: 0, population_m: 8.3 },
  { year: 1920, coal: 0, oil: 0.05, gas: 0, hydro: 0, solar: 0, wind: 0, bio: 0.8, nuclear: 0, population_m: 9.8 },
  { year: 1940, coal: 0.05, oil: 0.3, gas: 0, hydro: 0, solar: 0, wind: 0, bio: 1.2, nuclear: 0, population_m: 15.5 },
  { year: 1960, coal: 0.3, oil: 1.5, gas: 0, hydro: 0.2, solar: 0, wind: 0, bio: 2.5, nuclear: 0, population_m: 27.4 },
  { year: 1971, coal: 0.6, oil: 6.2, gas: 0, hydro: 1.1, solar: 0, wind: 0, bio: 5.0, nuclear: 0, co2_mt: 16, oil_demand_kbd: 130, population_m: 37.1 },
  { year: 1980, coal: 1.2, oil: 10.5, gas: 0.4, hydro: 1.6, solar: 0, wind: 0, bio: 7.5, nuclear: 0, co2_mt: 38, oil_demand_kbd: 230, population_m: 47.4 },
  { year: 1990, coal: 4.8, oil: 14.2, gas: 9.5, hydro: 5.1, solar: 0, wind: 0, bio: 9.8, nuclear: 0, co2_mt: 96, oil_demand_kbd: 410, population_m: 56.6 },
  { year: 2000, coal: 13.2, oil: 9.5, gas: 38.7, hydro: 6.0, solar: 0.01, wind: 0.01, bio: 1.2, nuclear: 0, co2_mt: 168, oil_demand_kbd: 745, population_m: 62.9 },
  { year: 2010, coal: 30.5, oil: 4.1, gas: 102.4, hydro: 5.6, solar: 0.04, wind: 0.04, bio: 5.4, nuclear: 0, co2_mt: 240, oil_demand_kbd: 988, population_m: 67.2 },
  { year: 2015, coal: 36.0, oil: 2.5, gas: 109.2, hydro: 6.0, solar: 2.5, wind: 0.3, bio: 12.0, nuclear: 0, co2_mt: 270, oil_demand_kbd: 1240, population_m: 68.7 },
  { year: 2018, coal: 36.5, oil: 1.8, gas: 113.5, hydro: 5.8, solar: 4.0, wind: 1.6, bio: 15.0, nuclear: 0, co2_mt: 282, oil_demand_kbd: 1330, population_m: 69.6 },
  { year: 2020, coal: 32.0, oil: 1.4, gas: 105.0, hydro: 5.5, solar: 5.0, wind: 1.7, bio: 17.5, nuclear: 0, co2_mt: 258, oil_demand_kbd: 1230, population_m: 70.0 },
  { year: 2022, coal: 33.5, oil: 1.3, gas: 110.5, hydro: 5.2, solar: 5.3, wind: 1.7, bio: 18.2, nuclear: 0, co2_mt: 270, oil_demand_kbd: 1290, population_m: 70.2 },
  { year: 2024, coal: 31.0, oil: 1.1, gas: 105.0, hydro: 5.5, solar: 6.5, wind: 1.8, bio: 19.5, nuclear: 0, co2_mt: 262, oil_demand_kbd: 1340, population_m: 70.5 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function buildHistorical(): YearRow[] {
  const rows: YearRow[] = [];
  for (let y = 1900; y <= 2024; y++) {
    // หา anchor ก่อนและหลัง
    let prev = ANCHOR_POINTS[0];
    let next = ANCHOR_POINTS[ANCHOR_POINTS.length - 1];
    for (let i = 0; i < ANCHOR_POINTS.length - 1; i++) {
      if (ANCHOR_POINTS[i].year! <= y && ANCHOR_POINTS[i + 1].year! >= y) {
        prev = ANCHOR_POINTS[i];
        next = ANCHOR_POINTS[i + 1];
        break;
      }
    }
    const span = next.year! - prev.year!;
    const t = span === 0 ? 0 : (y - prev.year!) / span;
    const get = (k: keyof YearRow) =>
      lerp((prev[k] as number) ?? 0, (next[k] as number) ?? 0, t);
    rows.push({
      year: y,
      coal: +get("coal").toFixed(2),
      oil: +get("oil").toFixed(2),
      gas: +get("gas").toFixed(2),
      hydro: +get("hydro").toFixed(2),
      solar: +get("solar").toFixed(3),
      wind: +get("wind").toFixed(3),
      bio: +get("bio").toFixed(2),
      nuclear: 0,
      co2_mt: +get("co2_mt").toFixed(1),
      oil_demand_kbd: Math.round(get("oil_demand_kbd")),
      population_m: +get("population_m").toFixed(1),
    });
  }
  return rows;
}

// ---------------------------------------------------------------
// Forecast scenarios 2025–2035
// ---------------------------------------------------------------
export type ScenarioId = "bau" | "transition" | "clean100";

export const SCENARIOS: { id: ScenarioId; label: string; description: string }[] = [
  {
    id: "bau",
    label: "Business as Usual",
    description:
      "ดำเนินตามแนวโน้มปัจจุบัน นโยบายเดิม การพึ่งพาก๊าซธรรมชาติยังคงอยู่ พลังงานสะอาดเพิ่มขึ้นช้าๆ",
  },
  {
    id: "transition",
    label: "Energy Transition",
    description:
      "นโยบายเร่งเปลี่ยนผ่าน ภาษีคาร์บอน + Renewable Portfolio Standard ลดถ่านหินและก๊าซลงต่อเนื่อง",
  },
  {
    id: "clean100",
    label: "100% Clean Energy",
    description:
      "เป้าหมายพลังงานสะอาด 100% ภายใน 10 ปี ตามสมมุติฐานในโปสเตอร์ Track C เปลี่ยนผ่านสุดทาง",
  },
];

function buildForecast(scenario: ScenarioId, base: YearRow): YearRow[] {
  const rows: YearRow[] = [];
  const totalBase =
    base.coal + base.oil + base.gas + base.hydro + base.solar + base.wind + base.bio;
  for (let y = 2025; y <= 2035; y++) {
    const t = (y - 2024) / 11; // 0..1
    let coal = 0,
      oil = 0,
      gas = 0,
      hydro = 0,
      solar = 0,
      wind = 0,
      bio = 0;
    const demandGrowth = 1 + 0.018 * (y - 2024); // โหลดไฟฟ้าโตปีละ ~1.8%
    const total = totalBase * demandGrowth;

    if (scenario === "bau") {
      const fossilShare = lerp(0.79, 0.65, t);
      const renewShare = 1 - fossilShare;
      coal = total * fossilShare * 0.22;
      gas = total * fossilShare * 0.76;
      oil = total * fossilShare * 0.02;
      hydro = total * renewShare * 0.18;
      solar = total * renewShare * 0.42;
      wind = total * renewShare * 0.1;
      bio = total * renewShare * 0.3;
    } else if (scenario === "transition") {
      const fossilShare = lerp(0.79, 0.4, t);
      const renewShare = 1 - fossilShare;
      coal = total * fossilShare * 0.15;
      gas = total * fossilShare * 0.83;
      oil = total * fossilShare * 0.02;
      hydro = total * renewShare * 0.16;
      solar = total * renewShare * 0.5;
      wind = total * renewShare * 0.14;
      bio = total * renewShare * 0.2;
    } else {
      // clean100
      const fossilShare = lerp(0.79, 0.0, t * 1.0);
      const renewShare = 1 - fossilShare;
      coal = total * fossilShare * 0.1;
      gas = total * fossilShare * 0.88;
      oil = total * fossilShare * 0.02;
      hydro = total * renewShare * 0.15;
      solar = total * renewShare * 0.55;
      wind = total * renewShare * 0.15;
      bio = total * renewShare * 0.15;
    }

    const co2 = coal * 0.95 + gas * 0.42 + oil * 0.78; // factor หยาบ Mt/TWh

    rows.push({
      year: y,
      coal: +coal.toFixed(2),
      oil: +oil.toFixed(2),
      gas: +gas.toFixed(2),
      hydro: +hydro.toFixed(2),
      solar: +solar.toFixed(2),
      wind: +wind.toFixed(2),
      bio: +bio.toFixed(2),
      nuclear: 0,
      co2_mt: +co2.toFixed(1),
      oil_demand_kbd: Math.round(
        scenario === "clean100"
          ? lerp(1340, 600, t)
          : scenario === "transition"
            ? lerp(1340, 950, t)
            : lerp(1340, 1450, t),
      ),
      population_m: +lerp(70.5, 69.5, t).toFixed(1),
    });
  }
  return rows;
}

const HISTORICAL = buildHistorical();
const LAST_HIST = HISTORICAL[HISTORICAL.length - 1];

export const FORECASTS: Record<ScenarioId, YearRow[]> = {
  bau: buildForecast("bau", LAST_HIST),
  transition: buildForecast("transition", LAST_HIST),
  clean100: buildForecast("clean100", LAST_HIST),
};

export function getSeries(scenario: ScenarioId): YearRow[] {
  return [...HISTORICAL, ...FORECASTS[scenario]];
}

export function getHistorical(): YearRow[] {
  return HISTORICAL;
}

export function totalGeneration(r: YearRow): number {
  return r.coal + r.oil + r.gas + r.hydro + r.solar + r.wind + r.bio + r.nuclear;
}

export function renewableShare(r: YearRow): number {
  const total = totalGeneration(r);
  if (total === 0) return 0;
  return ((r.hydro + r.solar + r.wind + r.bio) / total) * 100;
}

export function fossilShare(r: YearRow): number {
  const total = totalGeneration(r);
  if (total === 0) return 0;
  return ((r.coal + r.oil + r.gas) / total) * 100;
}

export const DATA_SOURCES = [
  {
    name: "DOEB Open Data",
    full: "กรมธุรกิจพลังงาน กระทรวงพลังงาน",
    url: "https://data.doeb.go.th/en/dataset/",
  },
  {
    name: "EIA Open Data",
    full: "U.S. Energy Information Administration",
    url: "https://www.eia.gov/opendata/",
  },
  {
    name: "OWID Energy Data",
    full: "Our World in Data — Energy Dataset",
    url: "https://github.com/owid/energy-data/",
  },
  {
    name: "Ember Electricity Data",
    full: "Ember — Yearly Electricity Data",
    url: "https://ember-energy.org/data/yearly-electricity-data/",
  },
  {
    name: "Ember Explorer",
    full: "Ember Electricity Data Explorer",
    url: "https://ember-energy.org/data/electricity-data-explorer/",
  },
];
