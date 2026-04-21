import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">ไม่พบหน้าที่คุณค้นหา</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          หน้าดังกล่าวอาจถูกย้ายหรือไม่มีอยู่จริง
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Post-Oil Futures Lab — ศูนย์ข้อมูลพลังงานเชิงพยากรณ์ | Track C" },
      {
        name: "description",
        content:
          "แดชบอร์ดข้อมูลและฉากทัศน์การเปลี่ยนผ่านพลังงานของประเทศไทย ตั้งแต่ปี 1900 จนถึงปี 2035 อ้างอิง DOEB, EIA, OWID และ Ember",
      },
      { name: "author", content: "Post-Oil Futures Lab — Track C" },
      { property: "og:title", content: "Post-Oil Futures Lab — ศูนย์ข้อมูลพลังงานเชิงพยากรณ์" },
      {
        property: "og:description",
        content:
          "แดชบอร์ดเชิงสำรวจ: 125 ปีของพลังงานไทย และฉากทัศน์ 10 ปีข้างหน้า",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
