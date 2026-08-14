"use client";

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

type ProcessTableProps = {
  processData: ProcessData[];
  totals: {
    penerimaan: number;
    reboxing: number;
    penataan: number;
    pencarian: number;
    pengiriman: number;
  };
};

export default function ProcessTable({
  processData,
  totals,
}: ProcessTableProps) {
  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* AREA SCROLL TABEL */}
      <div
        style={{
          maxHeight: "420px",
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "900px",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
                position: "sticky",
                top: 0,
                zIndex: 2,
              }}
            >
              <th style={headerStyle}>No</th>
              <th style={headerStyle}>Bulan</th>
              <th style={headerStyle}>Tahun</th>
              <th style={headerStyle}>Penerimaan (Dus)</th>
              <th style={headerStyle}>Reboxing (Dus)</th>
              <th style={headerStyle}>Penataan (Dus)</th>
              <th style={headerStyle}>Pencarian (Dus)</th>
              <th style={headerStyle}>Pengiriman (Dus)</th>
            </tr>
          </thead>

          <tbody>
            {processData.map((row) => (
              <tr key={`${row.no}-${row.bulan}`}>
                <td style={cellStyle}>{row.no}</td>
                <td style={cellStyle}>{row.bulan}</td>
                <td style={cellStyle}>{row.tahun}</td>
                <td style={cellStyle}>{row.penerimaan}</td>
                <td style={cellStyle}>{row.reboxing}</td>
                <td style={cellStyle}>{row.penataan}</td>
                <td style={cellStyle}>{row.pencarian}</td>
                <td style={cellStyle}>{row.pengiriman}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr
              style={{
                background: "#e8eaff",
                fontWeight: 700,
              }}
            >
              <td
                colSpan={3}
                style={{
                  ...cellStyle,
                  textAlign: "right",
                  fontWeight: 700,
                }}
              >
                Total (YTD):
              </td>

              <td style={cellStyle}>{totals.penerimaan}</td>
              <td style={cellStyle}>{totals.reboxing}</td>
              <td style={cellStyle}>{totals.penataan}</td>
              <td style={cellStyle}>{totals.pencarian}</td>
              <td style={cellStyle}>{totals.pengiriman}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  padding: "13px 14px",
  textAlign: "center",
  fontSize: "13px",
  fontWeight: 600,
  color: "#475569",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
};

const cellStyle: React.CSSProperties = {
  padding: "13px 14px",
  textAlign: "center",
  fontSize: "14px",
  color: "#334155",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
};