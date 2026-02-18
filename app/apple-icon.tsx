import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: "#0b2618",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f7f4ef",
          borderRadius: "36px",
          fontFamily: "Georgia, serif",
          fontWeight: 700,
        }}
      >
        M
      </div>
    ),
    {
      ...size,
    }
  );
}
