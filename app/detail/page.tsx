"use client";

import { useEffect, useMemo, useState } from "react";

import DetailHeader from "../../components/detail/DetailHeader";
import ProcessChart from "../../components/detail/ProcessChart";
import ProcessTable from "../../components/detail/ProcessTable";

type ProcessData = {
  no: number;
  bulan: string;
  tahun: string;
  penerimaan: number;
  reboxing: number;
  penataan: number;
  pencarian: number;
  pengiriman: number;
};

type ApiResponse = {
  success: boolean;
  sheet: string;
  total: number;
  data: string[][];
  message?: string;
};

const DETAIL_SHEET_NAME = "Detail Proses";

function numberValue(value: string | undefined) {
  if (value === undefined || value === null) {
    return 0;
  }

  const text = String(value).trim();

  if (!text) {
    return 0;
  }

  // Hilangkan pemisah ribuan dan karakter selain angka
  const cleaned = text.replace(/[^\d-]/g, "");

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

function normalizeHeader(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function findColumn(
  headers: string[],
  keywords: string[]
) {
  return headers.findIndex((header) => {
    const value = normalizeHeader(header);

    return keywords.some((keyword) =>
      value.includes(
        normalizeHeader(keyword)
      )
    );
  });
}

export default function DetailPage() {
  const [year, setYear] = useState("");
  const [years, setYears] = useState<string[]>([]);

  const [allData, setAllData] = useState<ProcessData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setError("");
        const response = await fetch(
          `/api/detail?t=${Date.now()}`,
          {
            cache: "no-store",
          }
        );

        const result: ApiResponse =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Gagal mengambil data Detail Proses"
          );
        }

        if (cancelled) return;

        const rows = result.data;

        if (!rows || rows.length < 2) {
          setAllData([]);
          setYears([]);
          setLoading(false);
          return;
        }

        /*
         * Baris pertama = header Google Sheets
         */
        const headers = rows[0];

        console.log(
          "HEADER DETAIL:",
          headers
        );

        /*
         * Cari index setiap kolom.
         */
        const noIndex = findColumn(
          headers,
          ["no"]
        );

        const bulanIndex = findColumn(
          headers,
          ["bulan", "month"]
        );

        const tahunIndex = findColumn(
          headers,
          ["tahun", "year"]
        );

        const penerimaanIndex = findColumn(
          headers,
          [
            "penerimaan (dus)",
            "penerimaan",
          ]
        );

        const reboxingIndex = findColumn(
          headers,
          [
            "reboxing (dus)",
            "reboxing",
          ]
        );

        const penataanIndex = findColumn(
          headers,
          [
            "penataan (dus)",
            "penataan",
          ]
        );

        const pencarianIndex = findColumn(
          headers,
          [
            "pencarian (dus)",
            "pencarian",
          ]
        );

        const pengirimanIndex = findColumn(
          headers,
          [
            "pengiriman (dus)",
            "pengiriman",
          ]
        );

        console.log("INDEX KOLOM:", {
          noIndex,
          bulanIndex,
          tahunIndex,
          penerimaanIndex,
          reboxingIndex,
          penataanIndex,
          pencarianIndex,
          pengirimanIndex,
        });

        /*
         * Ubah data Google Sheets
         * menjadi object aplikasi.
         */
        const parsed: ProcessData[] = rows
          .slice(1)
          .map((row, index) => {
            const data: ProcessData = {
              no:
                noIndex >= 0
                  ? Number(row[noIndex]) ||
                    index + 1
                  : index + 1,

              bulan:
                bulanIndex >= 0
                  ? String(
                      row[bulanIndex] ?? ""
                    ).trim()
                  : "",

              tahun:
                tahunIndex >= 0
                  ? String(
                      row[tahunIndex] ?? ""
                    ).trim()
                  : "",

              penerimaan:
                penerimaanIndex >= 0
                  ? numberValue(
                      row[penerimaanIndex]
                    )
                  : 0,

              reboxing:
                reboxingIndex >= 0
                  ? numberValue(
                      row[reboxingIndex]
                    )
                  : 0,

              penataan:
                penataanIndex >= 0
                  ? numberValue(
                      row[penataanIndex]
                    )
                  : 0,

              pencarian:
                pencarianIndex >= 0
                  ? numberValue(
                      row[pencarianIndex]
                    )
                  : 0,

              pengiriman:
                pengirimanIndex >= 0
                  ? numberValue(
                      row[pengirimanIndex]
                    )
                  : 0,
            };

            console.log(
              "DATA DETAIL:",
              data
            );

            return data;
          })
          .filter(
            (row) =>
              row.bulan !== "" &&
              row.tahun !== ""
          );

        /*
         * Ambil semua tahun yang tersedia
         * dari Google Sheets.
         */
        const uniqueYears = Array.from(
          new Set(
            parsed.map(
              (row) => row.tahun
            )
          )
        ).sort(
          (a, b) =>
            Number(b) - Number(a)
        );

        if (cancelled) return;

        setAllData(parsed);
        setYears(uniqueYears);

        /*
         * Pilih tahun terbaru jika belum ada.
         */
        setYear((currentYear) => {
          if (
            currentYear &&
            uniqueYears.includes(currentYear)
          ) {
            return currentYear;
          }

          return uniqueYears[0] || "";
        });

        setError("");
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Gagal mengambil Detail Proses:",
          err
        );

        setAllData([]);

        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data Google Sheets"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    /*
     * Ambil data saat halaman dibuka.
     */
    loadData();

    /*
     * Update otomatis setiap 5 detik.
     */
    const interval = setInterval(
      loadData,
      5000
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  /*
   * Filter data berdasarkan tahun
   * yang dipilih.
   */
  const processData = useMemo(() => {
    return allData
      .filter(
        (row) =>
          row.tahun === year
      )
      .sort(
        (a, b) =>
          normalizeMonth(a.bulan) -
          normalizeMonth(b.bulan)
      );
  }, [allData, year]);

  /*
   * Hitung total otomatis
   * berdasarkan tahun yang dipilih.
   */
  const totals = useMemo(() => {
    return processData.reduce(
      (acc, row) => ({
        penerimaan:
          acc.penerimaan +
          row.penerimaan,

        reboxing:
          acc.reboxing +
          row.reboxing,

        penataan:
          acc.penataan +
          row.penataan,

        pencarian:
          acc.pencarian +
          row.pencarian,

        pengiriman:
          acc.pengiriman +
          row.pengiriman,
      }),
      {
        penerimaan: 0,
        reboxing: 0,
        penataan: 0,
        pencarian: 0,
        pengiriman: 0,
      }
    );
  }, [processData]);

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            Memuat data Detail Proses...
          </div>
        </div>
      </main>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h2>
              Gagal mengambil data
            </h2>

            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Halaman Detail Proses
   */
  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        <DetailHeader
          year={year}
          setYear={setYear}
          years={years}
        />

        <ProcessChart
          processData={processData}
        />

        <ProcessTable
          processData={processData}
          totals={totals}
        />

        <div className="dashboard-footer">
          <span>
            Dashboard Monitoring Arsiparis
          </span>

          <span>
            Data tahun {year}
          </span>
        </div>

      </div>
    </main>
  );
}