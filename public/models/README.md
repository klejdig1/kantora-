# BuildOS authored conceptual architecture

These are **original fictional architectural interpretations for the BuildOS demonstration**. They are not official GENER 2 BIM, design, as-built models, measured replicas or photogrammetry outputs. Project naming and verified public portfolio facts are maintained separately by the application. All floor counts, dimensions, finishes, planting and spaces in this directory are synthetic.

The three browser-ready assets are deliberately different:

| Asset | Concept | Geometry |
| --- | --- | --- |
| `lakeview_concept.glb` | Residential | A twelve-level tower and stepped eight-level wing above a limestone podium; framed glazing on every side, projecting glass-railed balconies, privacy fins, planted setbacks, roof plant/solar panels, lobby, sidewalk/road and landscaping. |
| `toptani_concept.glb` | Retail | Four retail galleries surrounding a real open atrium, internal shop portals, paired escalators, glass balustrades, barrel skylight, screened facade and service roof. Hide roof and facade layers to inspect the internal mall. |
| `aba_concept.glb` | Commercial office | A slender twenty-level chamfered curtain-wall shaft with upper setbacks, mullions/fins, screened crown and distinct dark-stone two-level podium/arrival canopy/roof garden. |

`manifest.json` records hashes, actual mesh extents, byte/triangle counts, safe node names, stable component IDs, building/floor/layer/stage mappings and conceptual provenance. glTF is **Y-up, metres, ground Y=0**. Mesh positions are baked into the world frame. Node names contain only letters, digits and underscores. For example, `BuildingA_Floor_12_Windows_Glass_Blue` is beneath the `Architecture / BuildingA / Floor_12 / Windows` hierarchy. Repeated components are merged by semantic floor, layer and shared material to keep browser draw calls bounded; this is not a separate mesh for every mullion. Twenty-six PBR materials are shared. Structural and facade surfaces are opaque; only glazing uses transparency.

The canonical browser assets use a deterministic, self-contained GLB exporter in `generator/architecture.py`. Geometry is authored procedurally, including rounded outlines/rings, railings, frames, site geometry and interior features; no downloaded models, stock photos or generated image substitutes are used. The generator requires Python and NumPy already installed in the repository environment:

```powershell
.venv\Scripts\python.exe assets\architecture\generator\architecture.py
# Or rebuild just one model:
.venv\Scripts\python.exe assets\architecture\generator\architecture.py --only lakeview
```

`generator/build_with_blender.py` creates native editable Blender meshes directly from the same source, with material nodes, named hierarchy and custom properties. It was executed successfully with portable official Blender **4.5.9 LTS**. A residential native source is delivered as `lakeview_source.blend`, with a native Blender export `lakeview_blender.glb`. These supplemental source artifacts are not substituted for the canonical files in the manifest. To recreate them:

```powershell
& .runtime\tools\blender-4.5.9-windows-x64\blender.exe --background --threads 4 --python assets\architecture\generator\build_with_blender.py -- --only lakeview
```

`generator/render_with_blender.py` imports canonical geometry, creates a physically lit scene with soft sun/area light, real Cycles CPU shadows and denoising, saves editable `<key>_concept.blend` scenes and renders original 1440×1080 `<key>_concept.png` thumbnails. These are actual renders of the delivered geometry. To rebuild all three (or pass `-- --only aba`):

```powershell
& .runtime\tools\blender-4.5.9-windows-x64\blender.exe --background --threads 6 --python assets\architecture\generator\render_with_blender.py
```

Use an installed official Blender executable if the optional `.runtime` portable tool is absent; `.runtime` is not committed. Blender is needed only for native scene creation/renders, not normal application viewing. The main geometry generator does not require Blender, internet access or a GPU.

`residential(stage=1|2|3)` returns the same spatial scene at three physically different synthetic states (four built structural levels, eight built structural levels, finished concept). The independent `fixtures/vision_demo` Blender workflow uses this source for fixed-pose monitoring and distinct overlapping reconstruction views. Architectural GLBs and their thumbnails are **ground-truth authored concepts**, never reconstruction outputs and never proof of real construction completion. Approved progress comes from persisted domain approvals.

Validation:

```powershell
.venv\Scripts\python.exe -m pytest backend\tests\test_v3_architecture.py -q
```

The tests verify real finite binary geometry, bounds and hashes; no external resources; safe exact semantic node mapping; opaque default facade materials; distinct concepts; and complete residential floor mapping. Visual QA also inspected actual Blender output images. Browser interaction and authorization are covered by the application integration/E2E suites.

License/provenance: Original generated educational concept geometry and renders, created specifically for this repository. No third-party model, project drawing or project photography is incorporated. Available for this project's use, demonstration and modification. No claim of architectural accuracy to any named real project is made.

Verified delivery on 2026-10-27: `python -m pytest backend/tests/test_v3_architecture.py -q` returned **5 passed**. Portable Blender 4.5.9 completed native residential mesh authoring/export and all three final Cycles beauty renders; their PNGs were opened for visual inspection. Final canonical meshes: residential 57,312 triangles / 5,079,708 bytes; retail 34,244 triangles / 2,956,316 bytes; office 60,696 triangles / 5,267,120 bytes. Render output is visual proof of authored geometry, not proof of reconstruction or real project completion.
