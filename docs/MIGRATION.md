# Migration and feature parity

The original repository is preserved. This demo is a separate frontend, not a replacement production deployment.

| Original capability | Next demo implementation | Boundary |
|---|---|---|
| Engineer workspace and fixed-point updates | Capture, photo resize/preview, viewpoint labels, pending reports | Camera guidance is a checklist; no geometric coverage claim |
| Site update approval | Manager review/reject, notes, explicit publication, shared progress | Local audit events, not tamper-proof server records |
| Director execution dashboard | Portfolio bar chart, completion, overdue tasks, forecast/budget/expenses, first-pass inspection KPI | Synthetic financial totals; no editable financial ledger |
| ArchitecturalViewer | Three original GLBs, orbit/zoom, semantic floors, selected element highlight, structure visibility | Conceptual architecture, not official BIM |
| Evidence and model history | Clickable approved pins and dated report overlays | Pins illustrative; same asset for report history |
| Customer portal and publication | Scoped project/property, approved public summaries and photos, published completion | Single synthetic property grant; no production access control |
| Investor preview | Restricted read-only overview | No internal tasks, cost or review screen |
| Task assignment and validation | Manager assigns engineer/partner/property work, assignee submits, manager validates | Simplified tasks replace original dependency/deadline-version engine |
| Quality inspections and defects | Engineer results, manager resolution, first-pass KPI retains failed outcomes | No separate signed retest certificate |
| Partner packages | Assigned task view with submission | Simplified package workflow |
| Property maintenance | Toptani service tasks with submission and manager validation | No tenant messaging or dispatch integrations |
| Administration | Review, task assignment, issue resolution, local activity | No team account creation or authentication |
| Photogrammetry lab | Validated image counts/previews, progress simulation, corresponding prebuilt GLB | No reconstruction or AI accuracy claim |
| Financial documents, exports, notifications | Shared role views and local activity provide the demonstration handoff | PDF/OCR, email, real-time notifications and document signing are not migrated |
| Database, auth, external services | Local fixtures, role switch and localStorage | Intentionally excluded by frontend-only requirements |

Remaining production features above are disclosed rather than represented by inert controls. The core presentation flow is upload → review → approved internal indicators → explicit customer publication. All financial and schedule values are synthetic and must not be presented as real company performance.
