"use client";

import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ClipboardList,
} from "lucide-react";

type Props = {
  year: string;
  setYear: (year: string) => void;
  years: string[];
};

export default function DetailHeader({
  year,
  setYear,
  years,
}: Props) {
  return (
    <header
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "20px 24px",
        background: "rgba(248, 248, 255, 0.75)",
        border: "1px solid #e2e5f0",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(40, 50, 90, 0.04)",
        marginBottom: "20px",
      }}
    >
      {/* BREADCRUMB */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          fontSize: "11px",
          lineHeight: "1.4",
          color: "#6b7898",
          marginBottom: "13px",
        }}
      >
      </div>

      {/* HEADER UTAMA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "30px",
        }}
      >
        {/* KIRI */}
        <div
          style={{
            minWidth: 0,
          }}
        >
          {/* JUDUL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ClipboardList
              size={25}
              strokeWidth={2}
              style={{
                color: "#5146c7",
                flexShrink: 0,
              }}
            />

            <h1
              style={{
                margin: 0,
                fontSize: "25px",
                lineHeight: "1.25",
                fontWeight: 700,
                color: "#17233d",
                letterSpacing: "-0.2px",
              }}
            >
              DASHBOARD ARSIP
            </h1>
          </div>

          {/* SUBTITLE */}
          <p
            style={{
              margin: "5px 0 0 35px",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#7a87a5",
            }}
          >
            Monitoring Digitalisasi Kearsipan
          </p>
        </div>

        {/* KANAN */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            flexShrink: 0,
          }}
        >

          {/* TAHUN */}
          <div
            style={{
              height: "37px",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "0 11px",
              background: "#ffffff",
              border: "1px solid #e0e4ed",
              borderRadius: "6px",
              color: "#4d5a75",
              boxShadow:
                "0 1px 3px rgba(40, 50, 90, 0.03)",
            }}
          >
            <CalendarDays
              size={17}
              strokeWidth={2}
            />

            <select
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#4d5a75",
                fontFamily: "inherit",
                fontSize: "11px",
                fontWeight: 500,
                cursor: "pointer",
                padding: 0,
                minWidth: "75px",
              }}
            >
              {years.map((itemYear) => (
                <option
                  key={itemYear}
                  value={itemYear}
                >
                  Tahun {itemYear}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              strokeWidth={2}
              style={{
                color: "#66728b",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}