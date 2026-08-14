"use client";

import { useState } from "react";

type MonthlyData = {
  bulan: string;
  item: number;
  lembar: number;
  dus: number;
  stokBelumDigital: number;
  stokDusArsip: number;
};

type Totals = {
  item: number;
  lembar: number;
  dus: number;
  stokBelumDigital: number;
  stokDusArsip: number;
};

type Props = {
  monthlyData: MonthlyData[];
  totals: Totals;
};

/* =========================================================
   FORMAT ANGKA
========================================================= */

function safeNumber(value: unknown): number {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
}

function formatNumber(value: unknown): string {
  return new Intl.NumberFormat("id-ID").format(
    safeNumber(value)
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function DigitalisasiChart({
  monthlyData,
  totals,
}: Props) {
  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  /* =========================================================
     DATA YANG SUDAH DINORMALISASI
  ========================================================= */

  const data = monthlyData.map((item) => ({
    ...item,
    item: safeNumber(item.item),
    lembar: safeNumber(item.lembar),
    dus: safeNumber(item.dus),
    stokBelumDigital: safeNumber(
      item.stokBelumDigital
    ),
    stokDusArsip: safeNumber(
      item.stokDusArsip
    ),
  }));

 /* =========================================================
   UKURAN CHART
========================================================= */

const chartWidth = 1300;
const chartHeight = 430;

/*
  Area kiri khusus untuk angka sumbu.
  Dibuat lebih lebar supaya angka 0, 20, 40, dst
  tidak bertabrakan dengan batang pertama.
*/
const axisLeftX = 100;

const plotLeft = 145;
const plotRight = 1190;

const plotTop = 45;
const plotBottom = 395;

const plotWidth =
  plotRight - plotLeft;

const plotHeight =
  plotBottom - plotTop;

  /* =========================================================
     POSISI X
  ========================================================= */
  const getX = (index: number) => {
    if (data.length <= 0) {
      return plotLeft + plotWidth / 2;
    }

    // Posisi bulan dibuat di tengah setiap slot,
    // supaya batang Januari dan Desember tidak
    // keluar dari area grafik.
    return (
      plotLeft +
      (index + 0.5) *
        (plotWidth / data.length)
    );
  };

  /* =========================================================
     SKALA SUMBU KIRI
     
     ITEM
     DUS
     STOK BELUM DIGITAL
  ========================================================= */

  const maxLeftValue = Math.max(
    ...data.map((item) =>
      Math.max(
        safeNumber(item.item),
        safeNumber(item.dus),
        safeNumber(item.stokBelumDigital)
      )
    ),
    1
  );

  const leftStep = 20;

  const leftAxisMax = Math.max(
    Math.ceil(
      maxLeftValue / leftStep
    ) * leftStep,
    leftStep
  );

  /* =========================================================
     SKALA SUMBU KANAN
     
     LEMBAR
     STOK DUS ARSIP
  ========================================================= */

  const maxRightValue = Math.max(
    ...data.map((item) =>
      Math.max(
        safeNumber(item.lembar),
        safeNumber(item.stokDusArsip)
      )
    ),
    1
  );

  const rightStep = 2000;

  const rightAxisMax = Math.max(
    Math.ceil(
      maxRightValue / rightStep
    ) * rightStep,
    rightStep
  );

  /* =========================================================
     Y KIRI
  ========================================================= */

  const getYLeft = (value: number) => {
    const safeValue = safeNumber(value);

    return (
      plotBottom -
      (safeValue / leftAxisMax) *
        plotHeight
    );
  };

  /* =========================================================
     Y KANAN
  ========================================================= */

  const getYRight = (value: number) => {
    const safeValue = safeNumber(value);

    return (
      plotBottom -
      (safeValue / rightAxisMax) *
        plotHeight
    );
  };

  /* =========================================================
     POINTS LEMBAR
  ========================================================= */

  const lembarPoints = data
    .map(
      (item, index) =>
        `${getX(index)},${getYRight(
          item.lembar
        )}`
    )
    .join(" ");

  /* =========================================================
     POINTS STOK DUS ARSIP
  ========================================================= */

  const stokDusPoints = data
    .map(
      (item, index) =>
        `${getX(index)},${getYRight(
          item.stokDusArsip
        )}`
    )
    .join(" ");

  /* =========================================================
     ACTIVE DATA
  ========================================================= */

  const activeItem =
    activeIndex !== null
      ? data[activeIndex]
      : null;

  /* =========================================================
     BAR CONFIGURATION

     3 BAR:

     ITEM
     DUS
     STOK BELUM DIGITAL
  ========================================================= */

  const barWidth = 22;
  const barGap = 4;

  const groupWidth =
    barWidth * 3 + barGap * 2;

  const getBarX = (
    index: number,
    type:
      | "item"
      | "dus"
      | "stok"
  ) => {
    const center = getX(index);

    const groupStart =
      center - groupWidth / 2;

    if (type === "item") {
      return groupStart;
    }

    if (type === "dus") {
      return (
        groupStart +
        barWidth +
        barGap
      );
    }

    return (
      groupStart +
      (barWidth + barGap) * 2
    );
  };

  /* =========================================================
     TINGGI TOOLTIP
  ========================================================= */

  const tooltipWidth = 220;
  const tooltipHeight = 150;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "inherit",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          marginBottom: "10px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            lineHeight: 1.25,
            fontWeight: 700,
            color: "#20283a",
          }}
        >
          Ringkasan Bulanan
        </h2>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: "12px",
            color: "#7b879b",
          }}
        >
          Grafik dan rekapitulasi data per bulan
        </p>
      </div>

      {/* =====================================================
          CHART WRAPPER
      ===================================================== */}

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "auto",
          marginTop: "0px",
          paddingBottom: "4px",
        }}
      >
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
          height={chartHeight}
          preserveAspectRatio="xMidYMid meet"
          onClick={() =>
            setActiveIndex(null)
          }
          style={{
            display: "block",
            width: "100%",
            minWidth: "1100px",
            height: "auto",
            overflow: "visible",
            fontFamily: "inherit",
          }}
        >
          {/* =================================================
              BACKGROUND AREA GRAFIK
          ================================================= */}

          <rect
            x={plotLeft}
            y={plotTop}
            width={plotWidth}
            height={plotHeight}
            fill="transparent"
          />

          {/* =================================================
              GRID + AXIS
          ================================================= */}
          {Array.from(
            {
              length:
                Math.floor(
                  leftAxisMax /
                    leftStep
                ) + 1,
            },
            (_, index) => {
              const value =
                index * leftStep;

              const y =
                getYLeft(value);

              const rightValue =
                (value /
                  leftAxisMax) *
                rightAxisMax;

              return (
                <g
                  key={`grid-${index}`}
                >
                  {/* GRID */}
                  <line
                    x1={plotLeft}
                    x2={plotRight}
                    y1={y}
                    y2={y}
                    stroke="#e4e8ef"
                    strokeWidth="1"
                  />

                  {/* ANGKA SUMBU KIRI */}
                  <text
                    x={axisLeftX}
                    y={y + 4}
                    textAnchor="end"
                    fill="#718096"
                    fontSize="12"
                    fontWeight="400"
                    style={{
                      fontFamily: "inherit",
                    }}
                  >
                    {formatNumber(value)}
                  </text>

                  {/* ANGKA SUMBU KANAN */}
                  <text
                    x={plotRight + 28}
                    y={y + 4}
                    textAnchor="start"
                    fill="#718096"
                    fontSize="12"
                    fontWeight="400"
                    style={{
                      fontFamily: "inherit",
                    }}
                  >
                    {formatNumber(
                      Math.round(rightValue)
                    )}
                  </text>
                </g>
              );
            }
          )}

          {/* =================================================
              LABEL SUMBU KIRI
          ================================================= */}
          <text
            x={axisLeftX}
            y={25}
            textAnchor="end"
            fill="#718096"
            fontSize="12"
            fontWeight="600"
            style={{
              fontFamily: "inherit",
            }}
          >
            Jumlah
          </text>

          {/* =================================================
              LABEL SUMBU KANAN
          ================================================= */}
          <text
            x={plotRight + 28}
            y={25}
            textAnchor="start"
            fill="#718096"
            fontSize="12"
            fontWeight="600"
            style={{
              fontFamily: "inherit",
            }}
          >
            Lembar
          </text>

          {/* =================================================
              BAR CHART
          ================================================= */}
          {data.map(
            (item, index) => {
              const itemValue =
                safeNumber(
                  item.item
                );

              const dusValue =
                safeNumber(
                  item.dus
                );

              const stokValue =
                safeNumber(
                  item.stokBelumDigital
                );

              const itemY =
                getYLeft(
                  itemValue
                );

              const dusY =
                getYLeft(
                  dusValue
                );

              const stokY =
                getYLeft(
                  stokValue
                );

              const itemHeight =
                Math.max(
                  plotBottom -
                    itemY,
                  0
                );

              const dusHeight =
                Math.max(
                  plotBottom -
                    dusY,
                  0
                );

              const stokHeight =
                Math.max(
                  plotBottom -
                    stokY,
                  0
                );

              const isActive =
                activeIndex ===
                index;

              const opacity =
                activeIndex !==
                  null &&
                !isActive
                  ? 0.35
                  : 0.9;

              return (
                <g
                  key={`bar-group-${item.bulan}-${index}`}
                  onMouseEnter={() =>
                    setActiveIndex(
                      index
                    )
                  }
                  onMouseLeave={() =>
                    setActiveIndex(
                      null
                    )
                  }
                  onClick={(event) => {
                    event.stopPropagation();

                    setActiveIndex(
                      activeIndex ===
                        index
                        ? null
                        : index
                    );
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {/* =================================================
                      ITEM
                  ================================================= */}
                  {itemValue > 0 && (
                    <>
                      <rect
                        x={getBarX(
                          index,
                          "item"
                        )}
                        y={itemY}
                        width={
                          barWidth
                        }
                        height={
                          itemHeight
                        }
                        rx="3"
                        fill="#4F8FD9"
                        opacity={
                          opacity
                        }
                      />

                      <text
                        x={
                          getBarX(
                            index,
                            "item"
                          ) +
                          barWidth /
                            2
                        }
                        y={Math.max(
                          itemY -
                            8,
                          plotTop +
                            12
                        )}
                        textAnchor="middle"
                        fill="#667085"
                        fontSize="11"
                        fontWeight="500"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        {formatNumber(
                          itemValue
                        )}
                      </text>
                    </>
                  )}

                  {/* =================================================
                      DUS
                  ================================================= */}
                  {dusValue > 0 && (
                    <>
                      <rect
                        x={getBarX(
                          index,
                          "dus"
                        )}
                        y={dusY}
                        width={
                          barWidth
                        }
                        height={
                          dusHeight
                        }
                        rx="3"
                        fill="#F0A04B"
                        opacity={
                          opacity
                        }
                      />

                      <text
                        x={
                          getBarX(
                            index,
                            "dus"
                          ) +
                          barWidth /
                            2
                        }
                        y={Math.max(
                          dusY -
                            8,
                          plotTop +
                            12
                        )}
                        textAnchor="middle"
                        fill="#667085"
                        fontSize="11"
                        fontWeight="500"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        {formatNumber(
                          dusValue
                        )}
                      </text>
                    </>
                  )}

                  {/* =================================================
                      STOK ARSIP BELUM DIGITAL
                  ================================================= */}
                  {stokValue > 0 && (
                    <>
                      <rect
                        x={getBarX(
                          index,
                          "stok"
                        )}
                        y={stokY}
                        width={
                          barWidth
                        }
                        height={
                          stokHeight
                        }
                        rx="3"
                        fill="#22A06B"
                        opacity={
                          opacity
                        }
                      />

                      <text
                        x={
                          getBarX(
                            index,
                            "stok"
                          ) +
                          barWidth /
                            2
                        }
                        y={Math.max(
                          stokY -
                            8,
                          plotTop +
                            12
                        )}
                        textAnchor="middle"
                        fill="#667085"
                        fontSize="11"
                        fontWeight="500"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        {formatNumber(
                          stokValue
                        )}
                      </text>
                    </>
                  )}

                  {/* =================================================
                      LABEL BULAN
                  ================================================= */}
                  <text
                    x={getX(index)}
                    y={
                      plotBottom +
                      30
                    }
                    textAnchor="middle"
                    fill="#718096"
                    fontSize="12"
                    fontWeight="400"
                    style={{
                      fontFamily:
                        "inherit",
                    }}
                  >
                    {item.bulan}
                  </text>
                </g>
              );
            }
          )}

          {/* =================================================
              LINE JUMLAH LEMBAR
          ================================================= */}
          {data.length > 0 && (
            <polyline
              points={
                lembarPoints
              }
              fill="none"
              stroke="#D45B5B"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* =================================================
              POINT LEMBAR
          ================================================= */}
          {data.map(
            (item, index) => {
              const isActive =
                activeIndex ===
                index;

              return (
                <circle
                  key={`lembar-point-${item.bulan}-${index}`}
                  cx={getX(index)}
                  cy={getYRight(
                    item.lembar
                  )}
                  r={
                    isActive
                      ? 6
                      : 4
                  }
                  fill="#D45B5B"
                  stroke="white"
                  strokeWidth="2"
                  onMouseEnter={() =>
                    setActiveIndex(
                      index
                    )
                  }
                  onMouseLeave={() =>
                    setActiveIndex(
                      null
                    )
                  }
                  onClick={(event) => {
                    event.stopPropagation();

                    setActiveIndex(
                      activeIndex ===
                        index
                        ? null
                        : index
                    );
                  }}
                  style={{
                    cursor:
                      "pointer",
                  }}
                />
              );
            }
          )}

          {/* =================================================
              LINE STOK DUS ARSIP
          ================================================= */}
          {data.length > 0 && (
            <polyline
              points={
                stokDusPoints
              }
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* =================================================
              POINT STOK DUS ARSIP
          ================================================= */}
          {data.map(
            (item, index) => {
              const isActive =
                activeIndex ===
                index;

              return (
                <circle
                  key={`stok-dus-point-${item.bulan}-${index}`}
                  cx={getX(index)}
                  cy={getYRight(
                    item.stokDusArsip
                  )}
                  r={
                    isActive
                      ? 6
                      : 4
                  }
                  fill="#8B5CF6"
                  stroke="white"
                  strokeWidth="2"
                  onMouseEnter={() =>
                    setActiveIndex(
                      index
                    )
                  }
                  onMouseLeave={() =>
                    setActiveIndex(
                      null
                    )
                  }
                  onClick={(event) => {
                    event.stopPropagation();

                    setActiveIndex(
                      activeIndex ===
                        index
                        ? null
                        : index
                    );
                  }}
                  style={{
                    cursor:
                      "pointer",
                  }}
                />
              );
            }
          )}

          {/* =================================================
              TOOLTIP
          ================================================= */}
          {activeItem &&
            activeIndex !==
              null && (
              <g
                pointerEvents="none"
              >
                {(() => {
                  const pointX =
                    getX(
                      activeIndex
                    );

                  const pointY =
                    Math.min(
                      getYLeft(
                        activeItem.item
                      ),
                      getYLeft(
                        activeItem.dus
                      ),
                      getYLeft(
                        activeItem.stokBelumDigital
                      ),
                      getYRight(
                        activeItem.lembar
                      ),
                      getYRight(
                        activeItem.stokDusArsip
                      )
                    );

                  let tooltipX =
                    pointX -
                    tooltipWidth /
                      2;

                  if (
                    tooltipX <
                    plotLeft
                  ) {
                    tooltipX =
                      plotLeft;
                  }

                  if (
                    tooltipX +
                      tooltipWidth >
                    plotRight
                  ) {
                    tooltipX =
                      plotRight -
                      tooltipWidth;
                  }

                  let tooltipY =
                    pointY -
                    tooltipHeight -
                    14;

                  if (
                    tooltipY <
                    35
                  ) {
                    tooltipY =
                      pointY + 14;
                  }

                  return (
                    <>
                      {/* BOX */}
                      <rect
                        x={
                          tooltipX
                        }
                        y={
                          tooltipY
                        }
                        width={
                          tooltipWidth
                        }
                        height={
                          tooltipHeight
                        }
                        rx="8"
                        fill="white"
                        stroke="#dfe3eb"
                        strokeWidth="1"
                        style={{
                          filter:
                            "drop-shadow(0 4px 12px rgba(25,31,54,0.15))",
                        }}
                      />

                      {/* BULAN */}
                      <text
                        x={
                          tooltipX +
                          12
                        }
                        y={
                          tooltipY +
                          21
                        }
                        fontSize="11"
                        fontWeight="700"
                        fill="#20283a"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        {
                          activeItem.bulan
                        }
                      </text>

                      {/* ITEM */}

                      <text
                        x={
                          tooltipX +
                          12
                        }
                        y={
                          tooltipY +
                          43
                        }
                        fontSize="9"
                        fill="#697386"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        Jumlah Item
                      </text>

                      <text
                        x={
                          tooltipX +
                          tooltipWidth -
                          12
                        }
                        y={
                          tooltipY +
                          43
                        }
                        textAnchor="end"
                        fontSize="9"
                        fontWeight="600"
                        fill="#20283a"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        {formatNumber(
                          activeItem.item
                        )}
                      </text>

                      {/* LEMBAR */}
                      <text
                        x={
                          tooltipX +
                          12
                        }
                        y={
                          tooltipY +
                          64
                        }
                        fontSize="9"
                        fill="#697386"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        Jumlah Lembar
                      </text>

                      <text
                        x={
                          tooltipX +
                          tooltipWidth -
                          12
                        }
                        y={
                          tooltipY +
                          64
                        }
                        textAnchor="end"
                        fontSize="9"
                        fontWeight="600"
                        fill="#20283a"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        {formatNumber(
                          activeItem.lembar
                        )}
                      </text>

                      {/* DUS */}
                      <text
                        x={
                          tooltipX +
                          12
                        }
                        y={
                          tooltipY +
                          85
                        }
                        fontSize="9"
                        fill="#697386"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        Jumlah Dus
                      </text>

                      <text
                        x={
                          tooltipX +
                          tooltipWidth -
                          12
                        }
                        y={
                          tooltipY +
                          85
                        }
                        textAnchor="end"
                        fontSize="9"
                        fontWeight="600"
                        fill="#20283a"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        {formatNumber(
                          activeItem.dus
                        )}
                      </text>

                      {/* STOK BELUM DIGITAL */}
                      <text
                        x={
                          tooltipX +
                          12
                        }
                        y={
                          tooltipY +
                          106
                        }
                        fontSize="9"
                        fill="#697386"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        Stok Arsip Belum Digital
                      </text>

                      <text
                        x={
                          tooltipX +
                          tooltipWidth -
                          12
                        }
                        y={
                          tooltipY +
                          106
                        }
                        textAnchor="end"
                        fontSize="9"
                        fontWeight="600"
                        fill="#20283a"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        {formatNumber(
                          activeItem.stokBelumDigital
                        )}
                      </text>

                      {/* STOK DUS */}
                      <text
                        x={
                          tooltipX +
                          12
                        }
                        y={
                          tooltipY +
                          127
                        }
                        fontSize="9"
                        fill="#697386"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        Stok Dus Arsip
                      </text>

                      <text
                        x={
                          tooltipX +
                          tooltipWidth -
                          12
                        }
                        y={
                          tooltipY +
                          127
                        }
                        textAnchor="end"
                        fontSize="9"
                        fontWeight="600"
                        fill="#20283a"
                        style={{
                          fontFamily:
                            "inherit",
                        }}
                      >
                        {formatNumber(
                          activeItem.stokDusArsip
                        )}
                      </text>
                    </>
                  );
                })()}
              </g>
            )}
        </svg>
      </div>

      {/* =====================================================
          LEGEND
      ===================================================== */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          marginTop: "12px",
          marginBottom: "20px",
          color: "#718096",
          fontSize: "14px",
        }}
      >
        {/* ITEM */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "30px",
              height: "10px",
              borderRadius: "3px",
              background:
                "#4F8FD9",
              display: "inline-block",
            }}
          />

          Jumlah Item
        </div>

        {/* LEMBAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "30px",
              height: "3px",
              borderRadius: "3px",
              background:
                "#D45B5B",
              display: "inline-block",
              position: "relative",
            }}
          >
            <i
              style={{
                position:
                  "absolute",
                width: "7px",
                height: "7px",
                borderRadius:
                  "50%",
                background:
                  "#D45B5B",
                left: "11px",
                top: "-2px",
              }}
            />
          </span>

          Jumlah Lembar
        </div>

        {/* DUS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "30px",
              height: "10px",
              borderRadius: "3px",
              background:
                "#F0A04B",
              display: "inline-block",
            }}
          />

          Jumlah Dus
        </div>

        {/* STOK BELUM DIGITAL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "30px",
              height: "10px",
              borderRadius: "3px",
              background:
                "#22A06B",
              display: "inline-block",
            }}
          />

          Stok Arsip Belum Digital
        </div>

        {/* STOK DUS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "30px",
              height: "3px",
              borderRadius: "3px",
              background:
                "#8B5CF6",
              display: "inline-block",
              position: "relative",
            }}
          >
            <i
              style={{
                position:
                  "absolute",
                width: "7px",
                height: "7px",
                borderRadius:
                  "50%",
                background:
                  "#8B5CF6",
                left: "11px",
                top: "-2px",
              }}
            />
          </span>

          Stok Dus Arsip
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}
      <div
        style={{
          width: "100%",
          maxHeight: "330px",
          overflowX: "auto",
          overflowY: "auto",
          border: "1px solid #dfe3eb",
          borderRadius: "10px",
          background: "#ffffff",
          WebkitOverflowScrolling:
            "touch",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "1100px",
            borderCollapse: "collapse",
            borderSpacing: 0,
            fontSize: "13px",
            tableLayout: "fixed",
            color: "#475467",
          }}
        >
          <thead>
            <tr>
              {[
                "No",
                "Bulan",
                "Jumlah Item",
                "Jumlah Lembar",
                "Jumlah Dus",
                "Stok Arsip Belum Digital",
                "Stok Dus Arsip",
              ].map(
                (header) => (
                  <th
                    key={header}
                    style={{
                      padding:
                        "11px 12px",
                      fontSize:
                        "12px",
                      fontWeight: 600,
                      textAlign:
                        "left",
                      position:
                        "sticky",
                      top: 0,
                      zIndex: 2,
                      background:
                        "#f5f7fb",
                      color:
                        "#475467",
                    }}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {data.map(
              (row, index) => (
                <tr
                  key={`${row.bulan}-${index}`}
                >
                  <td
                    style={{
                      padding:
                        "10px 12px",
                    }}
                  >
                    {index + 1}
                  </td>

                  <td
                    style={{
                      padding:
                        "10px 12px",
                    }}
                  >
                    {row.bulan}
                  </td>

                  <td
                    style={{
                      padding:
                        "10px 12px",
                    }}
                  >
                    {formatNumber(
                      row.item
                    )}
                  </td>

                  <td
                    style={{
                      padding:
                        "10px 12px",
                    }}
                  >
                    {formatNumber(
                      row.lembar
                    )}
                  </td>

                  <td
                    style={{
                      padding:
                        "10px 12px",
                    }}
                  >
                    {formatNumber(
                      row.dus
                    )}
                  </td>

                  <td
                    style={{
                      padding: "10px 12px",
                    }}
                  >
                    {formatNumber(
                      row.stokBelumDigital
                    )}
                </td>
                
                <td
                  style={{
                    padding: "10px 12px",
                  }}
                >
                  {formatNumber(
                    row.stokDusArsip
                  )}
                </td>
                </tr>
              )
            )}
          </tbody>

          <tfoot>
            <tr>
              <td
                colSpan={2}
                style={{
                  padding: "11px 12px",
                  fontWeight: 700,
                }}
              >
                Total
              </td>

              <td
                style={{
                  padding: "11px 12px",
                  fontWeight: 700,
                }}
              >
                {formatNumber(totals.item)}
              </td>

              <td
                style={{
                  padding: "11px 12px",
                  fontWeight: 700,
                }}
              >
                {formatNumber(totals.lembar)}
              </td>

              <td
                style={{
                  padding: "11px 12px",
                  fontWeight: 700,
                }}
              >
                {formatNumber(totals.dus)}
              </td>

              {/* TOTAL STOK ARSIP BELUM DIGITAL */}
              <td
                style={{
                  padding: "11px 12px",
                  fontWeight: 700,
                }}
              >
                {formatNumber(
                  data.reduce(
                    (total, row) =>
                      total + row.stokBelumDigital,
                    0
                  )
                )}
              </td>

              {/* TOTAL STOK DUS ARSIP */}
              <td
                style={{
                  padding: "11px 12px",
                  fontWeight: 700,
                }}
              >
                {formatNumber(
                  data.reduce(
                    (total, row) =>
                      total + row.stokDusArsip,
                    0
                  )
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}