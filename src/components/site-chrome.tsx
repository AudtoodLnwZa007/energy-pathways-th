import { Link, useRouterState } from "@tanstack/react-router";
import { Database, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "หน้าแรก" },
  { to: "/dashboard", label: "แดชบอร์ดข้อมูล" },
  { to: "/scenarios", label: "ภาพอนาคต" },
  { to: "/about", label: "เกี่ยวกับโครงการ" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="gov-stripe h-1 w-full" aria-hidden />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-md gov-gradient shadow-elegant">
            <Database className="h-5 w-5 text-[var(--gov-gold)]" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Track C · Post-Oil Futures Lab
            </div>
            <div className="text-sm font-semibold text-foreground">
              ศูนย์ข้อมูลพลังงานเชิงพยากรณ์
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--gov-navy)] text-primary-foreground"
                    : "text-foreground/75 hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
          onClick={() => setOpen((o) => !o)}
          aria-label="เปิดเมนู"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 p-4">
            {NAV.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium",
                    active
                      ? "bg-[var(--gov-navy)] text-primary-foreground"
                      : "text-foreground/80 hover:bg-secondary",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[var(--gov-navy-deep)] text-primary-foreground/85">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--gov-gold)]/15">
              <Database className="h-5 w-5 text-[var(--gov-gold)]" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--gov-gold)]">
                Track C · BUILD
              </div>
              <div className="text-sm font-semibold text-white">
                Post-Oil Futures Lab
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
            แพลตฟอร์มข้อมูลและฉากทัศน์การเปลี่ยนผ่านพลังงานของประเทศไทย
            ใช้ scenario generation, generative modeling และ system dynamics
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">แหล่งข้อมูลหลัก</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a className="hover:text-[var(--gov-gold)]" href="https://data.doeb.go.th/en/dataset/" target="_blank" rel="noreferrer">DOEB Open Data — กรมธุรกิจพลังงาน</a></li>
            <li><a className="hover:text-[var(--gov-gold)]" href="https://www.eia.gov/opendata/" target="_blank" rel="noreferrer">U.S. EIA Open Data</a></li>
            <li><a className="hover:text-[var(--gov-gold)]" href="https://github.com/owid/energy-data/" target="_blank" rel="noreferrer">OWID Energy Data</a></li>
            <li><a className="hover:text-[var(--gov-gold)]" href="https://ember-energy.org/data/yearly-electricity-data/" target="_blank" rel="noreferrer">Ember Yearly Electricity Data</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">หมายเหตุ</h4>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
            ตัวเลขในแดชบอร์ดเป็นการบูรณาการจากแหล่งข้อมูลข้างต้น
            ค่า 1900–1970 ใช้การประมาณการเชิงประวัติศาสตร์ (OWID reconstruction)
            ค่า 2025–2035 เป็น scenario projection สำหรับวัตถุประสงค์เชิงวิเคราะห์เท่านั้น
            ไม่ใช่ตัวเลขทางการของรัฐบาล
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-primary-foreground/60 sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Post-Oil Futures Lab — Track C BUILD</span>
          <span>เพื่อการศึกษาและวิจัยสาธารณะ</span>
        </div>
      </div>
    </footer>
  );
}
