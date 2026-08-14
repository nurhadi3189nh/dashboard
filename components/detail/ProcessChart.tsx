"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

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

type ProcessChartProps = {
  processData: ProcessData[];
};

export default function ProcessChart({
  processData,
}: ProcessChartProps) {
  const data = processData.map((item) => ({
    bulan: item.bulan,
    penerimaan: item.penerimaan,
    reboxing: item.reboxing,
    penataan: item.penataan,
    pengiriman: item.pengiriman,
    pencarian: item.pencarian,
  }));

  return (
    <section className="dashboard-card">
      <div
        className="dashboard-card-header"
        style={{
          marginBottom: 8,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            lineHeight: 1.2,
            marginBottom: 6,
          }}
        >
          Tren Pemrosesan Fisik Bulanan
        </h2>

        <p
          style={{
            fontSize: 12,
            margin: 0,
          }}
        >
          Visualisasi aktivitas logistik dan penataan arsip
        </p>
      </div>

      <div
        style={{
          width: "100%",
          height: 350,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 18,
              right: 20,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
            />

            <XAxis
              dataKey="bulan"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
              }}
            />

            <YAxis
              domain={[0, "auto"]}
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
              }}
            />

            <Tooltip
              contentStyle={{
                fontSize: 12,
              }}
            />

            <Legend
              wrapperStyle={{
                fontSize: 13,
                paddingTop: 4,
              }}
            />

            {/* Penerimaan - BIRU */}
            <Bar
              dataKey="penerimaan"
              name="Penerimaan"
              fill="#2563eb"
              radius={[3, 3, 0, 0]}
              barSize={28}
              label={{
                position: "top",
                fontSize: 9,
              }}
            />

            {/* Reboxing - HIJAU */}
            <Bar
              dataKey="reboxing"
              name="Reboxing"
              fill="#16a34a"
              radius={[3, 3, 0, 0]}
              barSize={28}
              label={{
                position: "top",
                fontSize: 9,
              }}
            />

            {/* Penataan - ORANYE */}
            <Bar
              dataKey="penataan"
              name="Penataan"
              fill="#f59e0b"
              radius={[3, 3, 0, 0]}
              barSize={28}
              label={{
                position: "top",
                fontSize: 9,
              }}
            />

            {/* Pengiriman - UNGU / GARIS */}
            <Line
              type="monotone"
              dataKey="pengiriman"
              name="Pengiriman"
              stroke="#7c3aed"
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: "#7c3aed",
              }}
              activeDot={{
                r: 6,
              }}
              label={{
                position: "top",
                fontSize: 9,
                fill: "#7c3aed",
              }}
            />

            {/* Pencarian - MERAH / GARIS */}
            <Line
              type="monotone"
              dataKey="pencarian"
              name="Pencarian"
              stroke="#dc2626"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              dot={{
                r: 4,
                fill: "#dc2626",
              }}
              activeDot={{
                r: 6,
              }}
              label={{
                position: "top",
                fontSize: 9,
                fill: "#dc2626",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}