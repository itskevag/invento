import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

type Props = {
  value: string;
};

export default function BarcodePreview({ value }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!value || !svgRef.current) return;

    JsBarcode(svgRef.current, value, {
      format: "CODE128",
      displayValue: true,
      height: 70,
      margin: 10,
    });
  }, [value]);

  if (!value) {
    return null;
  }

  return (
    <div className="barcode-box">
      <svg ref={svgRef}></svg>
      <p>
        Barcode generated from SKU: <strong>{value}</strong>
      </p>
    </div>
  );
}