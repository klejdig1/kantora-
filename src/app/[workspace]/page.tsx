import Platform from "@/components/platform";
import { notFound } from "next/navigation";
import { roles, type Role } from "@/data/projects";
export function generateStaticParams() {
  return [...roles, "projects"].map((workspace) => ({ workspace }));
}
export default async function Workspace({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace } = await params;
  if (![...roles, "projects"].includes(workspace)) notFound();
  return (
    <Platform
      initialRole={workspace === "projects" ? "manager" : (workspace as Role)}
    />
  );
}
