"use client";

import {
  FileText,
  Package,
} from "lucide-react";

type Totals = {
  item: number;
  lembar: number;
  dus: number;
  stokBelumDigital: number;
  stokDusArsip: number;
};

type Props = {
  totals: Totals;
  year: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export default function SummaryCards({
  totals,
  year,
}: Props) {
  return (
    <section className="summary-grid">

      {/* JUMLAH ITEM */}
      <div className="summary-card">
        <div>
          <span className="card-label">
            Jumlah Item
          </span>

          <strong>
            {formatNumber(totals.item)}
          </strong>

          <span className="card-description">
            ↗ Data tahun {year}
          </span>
        </div>

        <div className="card-icon blue">
          <Package size={19} />
        </div>
      </div>

      {/* JUMLAH LEMBAR */}
      <div className="summary-card">
        <div>
          <span className="card-label">
            Jumlah Lembar
          </span>

          <strong>
            {formatNumber(totals.lembar)}
          </strong>

          <span className="card-description">
            ↗ Data tahun {year}
          </span>
        </div>

        <div className="card-icon purple">
          <FileText size={19} />
        </div>
      </div>

      {/* JUMLAH DUS */}
      <div className="summary-card">
        <div>
          <span className="card-label">
            Jumlah Dus
          </span>

          <strong>
            {formatNumber(totals.dus)}
          </strong>

          <span className="card-description">
            ↗ Data tahun {year}
          </span>
        </div>

        <div className="card-icon orange">
          <Package size={19} />
        </div>
      </div>

      {/* STOK ARSIP BELUM DIGITAL */}
      <div className="summary-card">
        <div>
          <span className="card-label">
            Stok Arsip Belum Digital
          </span>

          <strong>
            {formatNumber(
              totals.stokBelumDigital
            )}
          </strong>

          <span className="card-description">
            ↗ Data tahun {year}
          </span>
        </div>

        <div className="card-icon blue">
          <FileText size={19} />
        </div>
      </div>

      {/* STOK DUS ARSIP */}
      <div className="summary-card">
        <div>
          <span className="card-label">
            Stok Dus Arsip
          </span>

          <strong>
            {formatNumber(
              totals.stokDusArsip
            )}
          </strong>

          <span className="card-description">
            ↗ Data tahun {year}
          </span>
        </div>

        <div className="card-icon orange">
          <Package size={19} />
        </div>
      </div>

    </section>
  );
}