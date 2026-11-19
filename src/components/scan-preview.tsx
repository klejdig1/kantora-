"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { simulateReconstruction } from "@/lib/mock-services";
import { Button } from "@/components/ui/button";
const Viewer = dynamic(() => import("./three-d/building-viewer"), {
  ssr: false,
});
export default function ScanPreview({ model }: { model: string }) {
  const [images, setImages] = useState<string[]>([]),
    [progress, setProgress] = useState(0),
    [error, setError] = useState("");
  const urls = useRef<string[]>([]);
  useEffect(() => () => urls.current.forEach(URL.revokeObjectURL), []);
  return (
    <section>
      <h2>Photo-to-3D demonstration</h2>
      <p>
        Upload 3–12 overlapping views. This simulation loads your building’s
        prebuilt model; no geometry is reconstructed from your uploads.
      </p>
      <input
        aria-label="Overlapping scan photographs"
        type="file"
        multiple
        accept="image/*"
        disabled={progress > 0 && progress < 100}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (
            files.length > 12 ||
            files.some((f) => !f.type.startsWith("image/") || f.size > 10000000)
          ) {
            setError("Select up to 12 image files under 10 MB each.");
            return;
          }
          urls.current.forEach(URL.revokeObjectURL);
          urls.current = files.map(URL.createObjectURL);
          setImages(urls.current);
          setProgress(0);
          setError("");
        }}
      />
      <div className="photo-strip">
        {images.map((src, i) => (
          <img key={src} src={src} alt={`Scan view ${i + 1}`} width={100} />
        ))}
      </div>
      <p>
        {images.length} views selected. Coverage is a capture checklist, not
        measured geometric overlap.
      </p>
      <Button
        disabled={images.length < 3 || (progress > 0 && progress < 100)}
        onClick={async () => {
          try {
            setError("");
            await simulateReconstruction(images.length, setProgress, model);
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        Simulate processing
      </Button>
      {progress > 0 && <progress value={progress} max={100} />}
      <p role="status">
        {error ||
          (progress === 100
            ? "Simulation complete. Prebuilt model loaded below. No new model was generated."
            : progress > 0
              ? `Simulating preview preparation: ${progress}%`
              : "Select at least three overlapping views.")}
      </p>
      {progress === 100 && <Viewer file={model} floors={12} progress={100} />}
    </section>
  );
}
