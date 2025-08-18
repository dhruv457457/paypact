import React from "react";
import { QRCodeSVG } from "qrcode.react";

export default function PaymentQR({ url }: { url: string }) {
  return (
    <div className="p-4 bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow max-w-xs text-center flex flex-col items-center">
      <QRCodeSVG value={url} size={220} includeMargin className="rounded-xl" />
      <div className="text-[11px] mt-2 break-all text-gray-500">{url}</div>
    </div>
  );
}
