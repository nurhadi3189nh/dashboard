import { google } from "googleapis";

const spreadsheetId = process.env.GOOGLE_SHEET_ID;
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY;

if (!spreadsheetId) {
  throw new Error("GOOGLE_SHEET_ID belum tersedia di .env.local");
}

if (!clientEmail) {
  throw new Error("GOOGLE_CLIENT_EMAIL belum tersedia di .env.local");
}

if (!privateKey) {
  throw new Error("GOOGLE_PRIVATE_KEY belum tersedia di .env.local");
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

/**
 * Mengambil semua tab/sheet yang ada di Google Sheets.
 */
export async function getAllSheets() {
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties",
  });

  return response.data.sheets ?? [];
}

/**
 * Mengambil nama semua tab Google Sheets.
 */
export async function getSheetNames() {
  const allSheets = await getAllSheets();

  return allSheets
    .map((sheet) => sheet.properties?.title)
    .filter((name): name is string => Boolean(name));
}

/**Mengambil data dari tab tertentu.
 */
export async function getSheetData(
  sheetName: string
) {
  console.log(
    "Mengambil sheet:",
    JSON.stringify(sheetName)
  );

  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId,

      range: `'${sheetName}'!A:Z`,
    });

  const values =
    response.data.values ?? [];

  console.log(
    "JUMLAH BARIS:",
    values.length
  );

  return values;
}