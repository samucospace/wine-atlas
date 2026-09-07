import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#24372e",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "18px solid #d6b66c",
            borderRadius: "50%",
            height: 330,
            opacity: 0.95,
            position: "absolute",
            width: 330,
          }}
        />
        <div
          style={{
            background: "#b54843",
            border: "12px solid #f3eee3",
            borderRadius: "50%",
            height: 142,
            position: "absolute",
            width: 142,
          }}
        />
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 15,
            height: 330,
            justifyContent: "center",
            position: "absolute",
            width: 330,
          }}
        >
          <div style={{ background: "#d6b66c", height: 14, width: 330 }} />
          <div style={{ background: "#d6b66c", height: 14, width: 330 }} />
          <div style={{ background: "#d6b66c", height: 14, width: 330 }} />
        </div>
      </div>
    ),
    size,
  );
}