"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "../../components/dashboard/Header";
import SummaryCards from "../../components/dashboard/SummaryCards";
import DigitalisasiChart from "../../components/dashboard/DigitalisasiChart";

type MonthlyData = {
  bulan: string;
  item: number;
  lembar: number;
  dus: number;
  stokBelumDigital: number;
  stokDusArsip: number;
};

type ApiResponse = {
  success: boolean;
  sheet: string;
  total: number;
  data: string[][];
  message?: string;
};

function numberValue(value: string | undefined) {
  if (!value) return 0;

  const cleaned = value
    .toString()
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/[^\d-]/g, "");

  return Number(cleaned) || 0;
}

function normalizeMonth(value: string) {
  const month = value.trim().toLowerCase();

  const months: Record<string, number> = {
    januari: 0,
    jan: 0,
    februari: 1,
    feb: 1,
    maret: 2,
    mar: 2,
    april: 3,
    apr: 3,
    mei: 4,
    may: 4,
    juni: 5,
    jun: 5,
    juli: 6,
    jul: 6,
    agustus: 7,
    agt: 7,
    agu: 7,
    aug: 7,
    september: 8,
    sep: 8,
    oktober: 9,
    okt: 9,
    oct: 9,
    november: 10,
    nov: 10,
    desember: 11,
    des: 11,
    dec: 11,
  };

  return months[month] ?? -1;
}

function findColumn(
  headers: string[],
  keywords: string[]
) {
  return headers.findIndex((header) => {
    const value = header.toLowerCase().trim();

    return keywords.some((keyword) =>
      value.includes(keyword)
    );
  });
}

export default function DashboardPage() {
  const [year, setYear] = useState("");
  const [years, setYears] = useState<string[]>([]);

  const [monthlyData, setMonthlyData] =
    useState<MonthlyData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");

        /*
         * SATU SHEET SAJA.
         * Semua tahun ada di kolom Tahun.
         */
        const response = await fetch(
          "/api/dashboard",
          {
            cache: "no-store",
          }
        );

        const result: ApiResponse =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Gagal mengambil data Google Sheets"
          );
        }

        const rows = result.data;

        if (!rows || rows.length < 2) {
          setMonthlyData([]);
          setYears([]);
          return;
        }

        const headers = rows[0];

        const tahunIndex = findColumn(
          headers,
          ["tahun", "year"]
        );

        const bulanIndex = findColumn(
          headers,
          ["bulan", "month"]
        );

        const itemIndex = findColumn(
          headers,
          ["jumlah item", "item"]
        );

        const lembarIndex = findColumn(
          headers,
          ["jumlah lembar", "lembar"]
        );

        const dusIndex = findColumn(
          headers,
          ["jumlah dus", "dus", "box"]
        );

        const stokBelumDigitalIndex = findColumn(
          headers,
          [
            "stok arsip belum digital",
            "stok belum digital",
            "belum digital",
          ]
        );

        const stokDusArsipIndex = findColumn(
          headers,
          [
            "stok dus arsip",
            "stok dus",
            "dus arsip",
          ]
        );

        /*
         * Ambil semua tahun yang ada
         * di kolom Tahun.
         */
        const availableYears = Array.from(
          new Set(
            rows
              .slice(1)
              .map((row) =>
                tahunIndex >= 0
                  ? String(
                      row[tahunIndex] || ""
                    ).trim()
                  : ""
              )
              .filter((value) =>
                /^\d{4}$/.test(value)
              )
          )
        ).sort(
          (a, b) =>
            Number(b) - Number(a)
        );

        setYears(availableYears);

        /*
         * Kalau belum ada tahun yang dipilih,
         * otomatis pilih tahun terbaru.
         */
        if (!year) {
          const latestYear =
            availableYears[0] || "";

          setYear(latestYear);
          return;
        }

        /*
         * Kalau tahun yang dipilih sudah tidak
         * ada di Google Sheets.
         */
        if (
          !availableYears.includes(year)
        ) {
          setYear(
            availableYears[0] || ""
          );
          return;
        }

        /*
         * FILTER DATA BERDASARKAN KOLOM TAHUN.
         * Tidak mencari nama sheet lagi.
         */
        const parsed: MonthlyData[] =
          rows
            .slice(1)
            .filter((row) => {
              if (tahunIndex < 0) return true;

              return (
                String(row[tahunIndex]).trim() ===
                String(year).trim()
              );
            })
            .map((row) => ({
              bulan:
                bulanIndex >= 0
                  ? row[bulanIndex] || ""
                  : "",

              item:
                itemIndex >= 0
                  ? numberValue(
                      row[itemIndex]
                    )
                  : 0,

              lembar:
                lembarIndex >= 0
                  ? numberValue(
                      row[lembarIndex]
                    )
                  : 0,

              dus:
                dusIndex >= 0
                  ? numberValue(
                      row[dusIndex]
                    )
                  : 0,

              stokBelumDigital:
                stokBelumDigitalIndex >= 0
                  ? numberValue(
                      row[stokBelumDigitalIndex]
                    )
                  : 0,

              stokDusArsip:
                stokDusArsipIndex >= 0
                  ? numberValue(
                      row[stokDusArsipIndex]
                    )
                  : 0,
            }))
            .filter(
              (row) => row.bulan
            );

        parsed.sort(
          (a, b) =>
            normalizeMonth(
              a.bulan
            ) -
            normalizeMonth(
              b.bulan
            )
        );

        setMonthlyData(parsed);
      } catch (err) {
        console.error(err);

        setMonthlyData([]);

        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data Google Sheets"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

    /*
     * Update otomatis kalau data Google Sheets
     * berubah.
     */
    const interval = setInterval(
      loadDashboard,
      5000
    );

    return () =>
      clearInterval(interval);
  }, [year]);

  const totals = useMemo(() => {
    return monthlyData.reduce(
      (acc, row) => ({
        item:
          acc.item + row.item,

        lembar:
          acc.lembar + row.lembar,

        dus:
          acc.dus + row.dus,

        stokBelumDigital:
          acc.stokBelumDigital +
          row.stokBelumDigital,

        stokDusArsip:
          acc.stokDusArsip +
          row.stokDusArsip,
      }),
      {
        item: 0,
        lembar: 0,
        dus: 0,
        stokBelumDigital: 0,
        stokDusArsip: 0,
      }
    );
  }, [monthlyData]);

  if (loading) {
    return (
      <main
        style={{
          background: "#f5f7fb",
          minHeight: "100vh",
          padding: "24px 32px",
        }}
      >
        <div
          className="dashboard-container"
          style={{
            maxWidth: "1450px",
            margin: "0 auto",
          }}
        >
          Memuat data Google Sheets...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          background: "#f5f7fb",
          minHeight: "100vh",
          padding: "24px 32px",
        }}
      >
        <div
          className="dashboard-container"
          style={{
            maxWidth: "1450px",
            margin: "0 auto",
          }}
        >
          <h2>Gagal mengambil data</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "24px 32px",
      }}
    >
      <div
        className="dashboard-container"
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Header
          year={year}
          setYear={setYear}
          years={years}
        />

        <SummaryCards
          totals={totals}
          year={year}
        />

        <DigitalisasiChart
          monthlyData={monthlyData}
          totals={totals}
        />

        <div className="dashboard-footer">
          <span>Dashboard Monitoring Arsiparis</span>

          <span>Data tahun {year}</span>
        </div>
      </div>
    </main>
  );
}