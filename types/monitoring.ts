export interface DigitalisasiData {
  no: number;
  bulan: string;
  jumlahItem: number;
  jumlahLembar: number;
  jumlahDus: number;
}

export interface AktivitasData {
  no: number;
  bulan: string;
  penerimaan: number;
  reboxing: number;
  penataan: number;
  pencarian: number;
  pengiriman: number;
}

export interface YearData {
  year: number;
  hasilSheet: string;
  aktivitasSheet: string;
}