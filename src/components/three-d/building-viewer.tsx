"use client";
import {
  Component,
  Suspense,
  useMemo,
  useState,
  useEffect,
  useRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, OrbitControls, useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";
import type { Evidence } from "@/data/projects";
class ViewerBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="viewer-fallback">
        <h3>3D view unavailable</h3>
        <p>
          Enable WebGL or reload in a supported browser. Your project records
          are still available.
        </p>
        <button onClick={() => this.setState({ failed: false })}>
          Retry model
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function Model({
  file,
  floor,
  progress,
  planned,
  floors,
  layer,
  selected,
  onSelect,
  onReady,
}: {
  file: string;
  floor: number;
  progress: number;
  planned: boolean;
  floors: number;
  layer: string;
  selected: string;
  onSelect: (name: string) => void;
  onReady: (ready: boolean) => void;
}) {
  const asset = useGLTF("/models/" + file);
  useEffect(() => {
    onReady(true);
  }, [asset.scene, onReady]);
  const scene = useMemo(() => {
    const root = asset.scene.clone(true);
    root.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const match = object.name.match(/Floor_(\d+)/i);
      const n = match ? Number(match[1]) : 0;
      object.material = (
        Array.isArray(object.material) ? object.material : [object.material]
      ).map((original) => {
        const material = original.clone() as MeshStandardMaterial;
        if (
          (n && floor && n === floor) ||
          object.name.replaceAll("_", " ") === selected
        ) {
          material.emissive?.set("#F28C28");
          material.emissiveIntensity = 0.35;
        }
        if (!planned && n && n > Math.ceil((progress / 100) * floors)) {
          material.transparent = true;
          material.opacity = 0.12;
          material.depthWrite = false;
        }
        return material;
      });
      if (Array.isArray(object.material) && object.material.length === 1)
        object.material = object.material[0];
      object.visible =
        (!floor || !n || n === floor) &&
        (layer !== "structure" ||
          !/(Window|Glass|Facade|Balcon|Roof)/i.test(object.name));
    });
    return root;
  }, [asset.scene, floor, progress, planned, floors, layer, selected]);
  useEffect(
    () => () => {
      scene.traverse((o) => {
        if (o instanceof Mesh)
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            m.dispose(),
          );
      });
    },
    [scene],
  );
  return (
    <primitive
      dispose={null}
      object={scene}
      onClick={(e: {
        stopPropagation: () => void;
        object: { name: string };
      }) => {
        e.stopPropagation();
        onSelect(e.object.name.replaceAll("_", " "));
      }}
    />
  );
}
export default function BuildingViewer({
  file,
  floors,
  progress,
  evidence = [],
}: {
  file: string;
  floors: number;
  progress: number;
  evidence?: Evidence[];
}) {
  const [floor, setFloor] = useState(0),
    [planned, setPlanned] = useState(false),
    [layer, setLayer] = useState("all"),
    [selected, setSelected] = useState(""),
    [photo, setPhoto] = useState<Evidence | null>(null),
    [snapshot, setSnapshot] = useState("latest");
  const [loaded, setLoaded] = useState(false);
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const history = [...evidence].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
  const historic = history.find((e) => e.id === snapshot);
  const current = historic?.completion ?? progress;
  return (
    <section className="viewer-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">BUILDING INTELLIGENCE</p>
          <h2>
            {planned
              ? "Planned architectural concept"
              : "Approved construction stage"}
          </h2>
        </div>
        <span className="badge">
          {planned ? "Concept" : current + "% approved"}
        </span>
      </div>
      <div className="toolbar">
        <button
          className={!planned ? "selected" : "secondary"}
          onClick={() => setPlanned(false)}
        >
          Current stage
        </button>
        <button
          className={planned ? "selected" : "secondary"}
          onClick={() => setPlanned(true)}
        >
          Planned result
        </button>
        <select
          aria-label="Floor"
          value={floor}
          onChange={(e) => setFloor(Number(e.target.value))}
        >
          <option value={0}>Whole building</option>
          {Array.from({ length: floors }, (_, i) => (
            <option key={i} value={i + 1}>
              Floor {i + 1}
            </option>
          ))}
        </select>
        <select
          aria-label="Model layers"
          value={layer}
          onChange={(e) => setLayer(e.target.value)}
        >
          <option value="all">All layers</option>
          <option value="structure">Structure only</option>
        </select>
        <button
          className="secondary"
          onClick={() => {
            controls.current?.reset();
            setFloor(0);
            setSelected("");
          }}
        >
          Reset view
        </button>
      </div>
      <ViewerBoundary key={file}>
        <div className="model-canvas">
          <Canvas
            camera={{ position: [80, 65, 90], fov: 40 }}
            dpr={[1, 1.5]}
            gl={{ preserveDrawingBuffer: true }}
          >
            <color attach="background" args={["#edf1f4"]} />
            <ambientLight intensity={1.4} />
            <directionalLight position={[40, 80, 60]} intensity={2.8} />
            <Suspense fallback={null}>
              <Bounds fit clip observe margin={1.25}>
                <Model
                  file={file}
                  floor={floor}
                  progress={current}
                  planned={planned}
                  floors={floors}
                  layer={layer}
                  selected={selected}
                  onSelect={setSelected}
                  onReady={setLoaded}
                />
              </Bounds>
              {evidence.slice(0, 4).map((e, i) => (
                <mesh
                  key={e.id}
                  position={[-12 + i * 8, 8 + i * 3, 15]}
                  onClick={(event) => {
                    event.stopPropagation();
                    setPhoto(e);
                  }}
                >
                  <sphereGeometry args={[0.8, 16, 16]} />
                  <meshBasicMaterial color="#F28C28" />
                </mesh>
              ))}
            </Suspense>
            <OrbitControls
              ref={controls}
              makeDefault
              minDistance={5}
              maxDistance={220}
            />
          </Canvas>
        </div>
      </ViewerBoundary>
      <p className="fine-print" role="status">
        {loaded
          ? "Model ready · local GLB loaded"
          : "Loading architectural model…"}
      </p>
      <div className="photo-strip">
        {evidence.slice(0, 4).map((e, i) => (
          <button
            key={e.id}
            className="secondary"
            aria-label={"Evidence " + e.point + " " + e.completion + "%"}
            onClick={() => setPhoto(e)}
          >
            Evidence {i + 1} · {e.point}
          </button>
        ))}
      </div>
      <div className="viewer-caption">
        <span>Drag to orbit · scroll to zoom · click an element</span>
        <label>
          Approved history
          <select
            aria-label="Approved history"
            value={snapshot}
            onChange={(e) => setSnapshot(e.target.value)}
          >
            <option value="latest">Latest approved</option>
            {history.map((e) => (
              <option key={e.id} value={e.id}>
                {e.createdAt.slice(0, 10)} · {e.completion}%
              </option>
            ))}
          </select>
        </label>
      </div>
      {selected && <p role="status">Selected element: {selected}</p>}
      {photo && (
        <div className="evidence-detail">
          <img
            src={photo.image}
            width={200}
            alt="Model-linked approved evidence"
          />
          <div>
            <h3>
              {photo.point} · {photo.completion}%
            </h3>
            <p>{photo.publicSummary ?? "Approved site photograph"}</p>
            <button className="secondary" onClick={() => setPhoto(null)}>
              Close evidence
            </button>
          </div>
        </div>
      )}
      <p className="fine-print">
        Authored conceptual architecture. Floor shading illustrates the reported
        completion; it is not measured geometry. Evidence pins are illustrative
        locations. History reuses this asset with dated approved progress.
      </p>
    </section>
  );
}
