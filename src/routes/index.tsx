import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Database, GitBranch, LineChart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  getHistorical,
  renewableShare,
  totalGeneration,
  DATA_SOURCES,
} from "@/lib/energy-data";
import { rowAt } from "@/components/charts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "หน้าแรก — Post-Oil Futures Lab" },
      {
        name: "description",
        content:
          "ภาพรวมข้อมูลพลังงานไทย 1900–2035 และทางเลือกฉากทัศน์อนาคต",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const hist = getHistorical();
  const latest = hist[hist.length - 1];
  const renew = renewableShare(latest);
  const total = totalGeneration(latest);
  const future = rowAt("clean100", 2035);
  const futureRenew = future ? renewableShare(future) : 0;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden gov-gradient text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gov-gold)]/40 bg-[var(--gov-gold)]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--gov-gold)]">
              <Sparkles className="h-3.5 w-3.5" />
              Track C · BUILD · Speculative Energies
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-balance sm:text-5xl lg:text-6xl">
              ศูนย์ข้อมูลพลังงาน
              <br />
              <span className="text-[var(--gov-gold)]">เชิงพยากรณ์ของประเทศไทย</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
              แดชบอร์ดเชิงสำรวจที่บูรณาการข้อมูลพลังงานย้อนหลัง 125 ปี
              จาก DOEB, EIA, OWID และ Ember Energy เข้ากับฉากทัศน์
              การเปลี่ยนผ่านพลังงาน 10 ปีข้างหน้า
              ผ่าน scenario generation, generative modeling และ system dynamics
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--gov-gold)] px-5 py-3 text-sm font-semibold text-[var(--gov-navy-deep)] shadow-elegant transition-transform hover:scale-[1.02]"
              >
                เปิดแดชบอร์ดข้อมูล
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/scenarios"
                className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                ดูภาพอนาคต 3 ฉากทัศน์
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="gov-stripe absolute bottom-0 left-0 right-0 h-1" aria-hidden />
      </section>

      {/* KEY STATS */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "ปีของข้อมูล",
              value: `${hist[0].year}–2035`,
              hint: "1900 ถึง 2035 (125 + 11 ปี)",
            },
            {
              label: "การผลิตไฟฟ้า ปี 2024",
              value: total.toFixed(0),
              unit: "TWh",
              hint: `รวมทุกแหล่งพลังงานในประเทศไทย`,
            },
            {
              label: "สัดส่วนพลังงานสะอาด ปัจจุบัน",
              value: renew.toFixed(1) + "%",
              hint: "Hydro + Solar + Wind + Bio",
            },
            {
              label: "เป้าหมายปี 2035 (Clean 100)",
              value: futureRenew.toFixed(0) + "%",
              hint: "ฉากทัศน์พลังงานสะอาดสุดทาง",
            },
          ].map((s) => (
            <div key={s.label} className="bg-card p-6">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold tabular-nums text-foreground">
                  {s.value}
                </span>
                {s.unit && <span className="text-sm text-muted-foreground">{s.unit}</span>}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{s.hint}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--gov-navy)]">
            สิ่งที่คุณทำได้บนแพลตฟอร์มนี้
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            สำรวจอดีต เข้าใจปัจจุบัน จำลองอนาคต
          </h2>
          <p className="mt-4 text-muted-foreground">
            จากข้อมูลพลังงานย้อนหลังกว่าหนึ่งศตวรรษ สู่ฉากทัศน์ที่เป็นไปได้
            สามแบบสำหรับการตัดสินใจเชิงนโยบาย
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: BarChart3,
              title: "แดชบอร์ดข้อมูลย้อนหลัง",
              desc: "Energy mix ของไทยตั้งแต่ปี 1900 ถึงปัจจุบัน เลือกช่วงปี เลือกแหล่งพลังงาน เปรียบเทียบสัดส่วน",
              to: "/dashboard",
            },
            {
              icon: GitBranch,
              title: "สามฉากทัศน์อนาคต",
              desc: "Business as Usual / Energy Transition / 100% Clean Energy เปรียบเทียบเส้นทางสู่ปี 2035",
              to: "/scenarios",
            },
            {
              icon: LineChart,
              title: "ตัวชี้วัด CO₂ และต้นทุน",
              desc: "ดูแนวโน้มการปล่อย CO₂ และอุปสงค์น้ำมัน ภายใต้แต่ละสมมุติฐาน",
              to: "/dashboard",
            },
          ].map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-[var(--gov-navy)] hover:shadow-elegant"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--gov-navy)] text-[var(--gov-gold)]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--gov-navy)] group-hover:gap-2 transition-all">
                เข้าใช้งาน <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DATA SOURCES */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-[var(--gov-navy)]" />
            <h2 className="font-display text-2xl font-semibold text-foreground">
              อ้างอิงจากแหล่งข้อมูลเปิด
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DATA_SOURCES.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg border border-border bg-card p-5 transition-all hover:border-[var(--gov-navy)] hover:shadow-card"
              >
                <div className="font-display text-sm font-semibold text-foreground">{s.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.full}</div>
                <div className="mt-3 truncate text-xs text-[var(--gov-navy)]">{s.url}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
