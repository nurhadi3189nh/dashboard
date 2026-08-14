import { NextResponse } from "next/server";

import {
  getAllSheets,
  getSheetData,
} from "../../../lib/google-sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    console.log("=================================");
    console.log("API DETAIL PROSES");

    // Ambil semua tab Google Sheets
    const allSheets = await getAllSheets();

    const sheetNames = allSheets
      .map((sheet) => sheet.properties?.title)
      .filter(
        (name): name is string =>
          Boolean(name)
      );

    console.log(
      "SEMUA NAMA TAB:",
      sheetNames
    );

    // Cari tab "Detail Proses"
    // trim + lowercase supaya aman dari spasi tersembunyi
    const selectedSheet = sheetNames.find(
      (name) =>
        name.trim().toLowerCase() ===
        "detail proses"
    );

    if (!selectedSheet) {
      return NextResponse.json({
        success: false,
        message:
          "Tab Detail Proses tidak ditemukan",
        sheets: sheetNames,
      });
    }

    console.log(
      "TAB DETAIL YANG DITEMUKAN:",
      JSON.stringify(selectedSheet)
    );

    const rows =
      await getSheetData(selectedSheet);

    console.log(
      "JUMLAH BARIS:",
      rows.length
    );

    return NextResponse.json(
      {
        success: true,
        sheet: selectedSheet,
        total: rows.length,
        data: rows,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "ERROR API DETAIL:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data Detail Proses",
      },
      { status: 500 }
    );
  }
}