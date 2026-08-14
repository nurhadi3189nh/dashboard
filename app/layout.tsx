"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderArchive,
} from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="id">
      <body>
        <div className="app-layout">

          {/* SIDEBAR */}
          <aside className="sidebar">

            {/* LOGO */}
            <div
              className="sidebar-logo"
              style={{
                height: "195px",
                padding: "25px 20px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <img
                src="/logo-skkmigas-log-rbg.png"
                alt="SKK Migas"
                style={{
                  width: "200px",
                  height: "150px",
                  objectFit: "contain",
                  display: "block",
                  marginBottom: "2px",
                  filter:
                    "drop-shadow(0 0 6px rgba(18, 17, 17, 0.95))",
                }}
              />

              <div
                className="sidebar-logo-text"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  lineHeight: "1.2",
                  gap: "4px",
                }}
              >
                <strong
                  style={{
                    fontSize: "21px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  SKK MIGAS
                </strong>

                <span
                  style={{
                    marginTop: "0",
                    fontSize: "15px",
                    fontWeight: 500,
                    letterSpacing: "0.3px",
                  }}
                >
                  SUMBAGSEL
                </span>
              </div>
            </div>

            {/* MENU */}
            <div className="sidebar-menu">
              <div className="sidebar-section-title">
                MAIN MENU
              </div>

              {/* DASHBOARD */}
              <Link
                href="/dashboard"
                className="sidebar-menu-item"
                style={{
                  background:
                    pathname === "/dashboard"
                      ? "rgba(255, 255, 255, 0.16)"
                      : "transparent",

                  borderLeft:
                    pathname === "/dashboard"
                      ? "4px solid #ffffff"
                      : "4px solid transparent",
                }}
              >
                <LayoutDashboard size={19} />
                <span>Dashboard</span>
              </Link>

              {/* DETAIL PENGOLAHAN */}
              <Link
                href="/detail"
                className="sidebar-menu-item"
                style={{
                  background:
                    pathname === "/detail"
                      ? "rgba(255, 255, 255, 0.16)"
                      : "transparent",

                  borderLeft:
                    pathname === "/detail"
                      ? "4px solid white"
                      : "4px solid transparent",
                }}
              >
                <FolderArchive size={19} />
                <span>Detail</span>
              </Link>
            </div>

            {/* CREATED BY */}
            <div
              style={{
                marginTop: "auto",
                padding: "18px 14px 20px",
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.65)",
                borderTop:
                  "1px solid rgba(255, 255, 255, 0.10)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                }}
              >
                Created by
              </div>

              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  lineHeight: "1.6",
                  color: "rgba(255, 255, 255, 0.85)",
                }}
              >
                Navassa Anastha
                <br />
                Selviramadani
              </div>
            </div>

          </aside>

          {/* CONTENT */}
          <main className="main-content">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}