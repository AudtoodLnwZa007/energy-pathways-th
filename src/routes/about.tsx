import { createFileRoute } from "@tanstack/react-router";
import { DATA_SOURCES } from "@/lib/energy-data";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "เกี่ยวกับโครงการ — Post-Oil Futures Lab" },
      {
        name: "description",
        content:
          "เกี่ยวกับ Track C: Speculative Energies และระเบียบวิธีของแดชบอร์ด",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--gov-navy)]">
        เกี่ยวกับโครงการ
      </div>
      <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
        Track C — Speculative Energies (Post-Oil Futures Lab)
      </h1>

      <div className="prose prose-sm mt-8 max-w-none text-foreground">
        <p className="text-base leading-relaxed text-muted-foreground">
          Track C เน้นการสร้างและสำรวจชุดข้อมูลของ <strong>อนาคตพลังงาน</strong> ผ่านชุดข้อมูล{" "}
          <strong>Ember Electricity Data, OWID, EIA และ DOEB Open Data</strong> เท่านั้น
          โดยใช้ scenario generation, generative modeling และ system dynamics
          เพื่อจำลองเส้นทางการเปลี่ยนผ่านพลังงานและระบบหลังยุคปิโตรเลียม
        </p>

        <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
          แหล่งข้อมูลแต่ละชุดทำหน้าที่อะไร
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Ember</strong> — ให้ข้อมูลไฟฟ้า เช่น
            generation, demand, capacity และ emissions ระดับประเทศ
            เพื่อสนับสนุนการวิเคราะห์การเปลี่ยนผ่านพลังงาน
          </li>
          <li>
            <strong className="text-foreground">OWID, EIA และ DOEB Open Data</strong> —
            ช่วยเติมข้อมูลเชิงระบบระยะยาว ทั้งในระดับโลกและระดับประเทศไทย
            เพื่อใช้สร้างภาพอนาคตพลังงานที่มีความเป็นไปได้
            เชื่อมโยงกับบริบทเชิงสังคม เศรษฐกิจ และโครงสร้างพลังงานจริงมากขึ้น
          </li>
        </ul>

        <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
          ระเบียบวิธี (Methodology)
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Historical Reconstruction (1900–1970):</strong>{" "}
            ใช้การประมาณการเชิงประวัติศาสตร์ของ OWID
            ซึ่งระบบไฟฟ้าไทยยังเล็กมากในช่วงนี้
            พลังงานชีวมวลดั้งเดิมเป็นองค์ประกอบหลัก
          </li>
          <li>
            <strong className="text-foreground">Consolidated Observations (1971–2024):</strong>{" "}
            บูรณาการข้อมูลจาก EIA, OWID Energy Dataset, Ember Yearly Electricity Data
            และ DOEB Open Data เป็นค่าเดียวต่อปีต่อแหล่งพลังงาน
          </li>
          <li>
            <strong className="text-foreground">Scenario Projection (2025–2035):</strong>{" "}
            สร้าง 3 ฉากทัศน์ (BAU, Transition, Clean 100)
            ปรับ fossil/renewable share ตามสมมุติฐานเชิงนโยบาย
            ประมาณการ load growth ปีละ ~1.8% ต่อปี
          </li>
          <li>
            <strong className="text-foreground">Emission Estimation:</strong>{" "}
            คำนวณ CO₂ จากการผลิตไฟฟ้าด้วย emission factor มาตรฐาน
            (ถ่านหิน 0.95, ก๊าซ 0.42, น้ำมัน 0.78 Mt CO₂/TWh)
          </li>
        </ol>

        <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
          แหล่งข้อมูลเปิด (Open Data Sources)
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {DATA_SOURCES.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-4 no-underline transition-all hover:border-[var(--gov-navy)]"
            >
              <div>
                <div className="font-display text-sm font-semibold text-foreground">{s.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.full}</div>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-dashed border-border bg-secondary/40 p-5 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">ข้อจำกัดและข้อพึงระวัง:</strong>{" "}
          แดชบอร์ดนี้เป็นเครื่องมือเชิงสำรวจสำหรับการศึกษาและงานวิจัยสาธารณะ
          ตัวเลขในส่วนคาดการณ์ (2025–2035) ขึ้นอยู่กับสมมุติฐาน
          ไม่ควรใช้แทนข้อมูลทางการของรัฐบาลไทยหรือหน่วยงานพลังงานระหว่างประเทศ
          ในการตัดสินใจเชิงนโยบายควรอ้างอิงข้อมูลปฐมภูมิจาก DOEB, IEA, EPPO และ EGAT โดยตรง
        </div>
      </div>
    </div>
  );
}
