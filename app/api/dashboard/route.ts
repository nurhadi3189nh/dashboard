import { NextRequest, NextResponse } from "next/server";
import {
  getAllSheets,
  getSheetData,
} from "../../../lib/google-sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const sheetParam =
      req.nextUrl.searchParams.get("sheet");

    // Ambil semua tab yang tersedia di Google Sheets
    const allSheets = await getAllSheets();

    const sheetNames = allSheets
      .map((sheet) => sheet.properties?.title)
      .filter(
        (name): name is string => Boolean(name)
      );

    console.log("=================================");
    console.log("API DASHBOARD");
    console.log("SEMUA TAB:", sheetNames);

    // Kalau hanya meminta daftar tahun/tab
    if (sheetParam === "list") {
      return NextResponse.json({
        success: true,
        sheets: sheetNames,
      });
    }

    // Kalau belum memilih tab, gunakan tab pertama
    const selectedSheet =
      sheetParam && sheetNames.includes(sheetParam)
        ? sheetParam
        : sheetNames[0];

    if (!selectedSheet) {
      return NextResponse.json({
        success: true,
        sheet: "",
        total: 0,
        data: [],
        sheets: [],
      });
    }

    console.log("SHEET YANG DIPAKAI:", selectedSheet);

    const rows = await getSheetData(selectedSheet);

    return NextResponse.json({
      success: true,
      sheet: selectedSheet,
      total: rows.length,
      data: rows,
      sheets: sheetNames,
    });
  } catch (error) {
    console.error(
      "ERROR API DASHBOARD:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan",
      },
      { status: 500 }
    );
  }
}