"use client";

import { mainAreas } from "@/app/lib/mock-data";
import { AdminPanel } from "./AdminPanel";
import { ComplianceManager } from "./ComplianceManager";
import { IndexedCatalogManager } from "./IndexedCatalogManager";
import { KnowledgeBaseManager } from "./KnowledgeBaseManager";
import { ToolDataManager } from "./ToolDataManager";
import { VisibilityList, VisibilityRow } from "./VisibilityList";
import { toggleAreaVisibility, useHiddenAreas } from "./admin-store";
import { useSavedFlash } from "./useSavedFlash";

export function ContentView() {
  return (
    <>
      <MainAreasManager />
      <IndexedCatalogManager />
      <KnowledgeBaseManager />
      <ToolDataManager />
      <ComplianceManager />
    </>
  );
}

function MainAreasManager() {
  const hiddenAreas = useHiddenAreas();
  const { saved, record } = useSavedFlash();

  return (
    <AdminPanel id="admin-main-areas" title="Main areas" description="Choose which main area pages customers can open." saved={saved}>
      <VisibilityList label="Main areas">
        {mainAreas.map((area) => {
          const visible = !hiddenAreas.includes(area.slug);
          return (
            <VisibilityRow
              key={area.slug}
              title={area.title}
              name={area.title}
              description={area.description}
              visible={visible}
              onToggle={() => {
                toggleAreaVisibility(area.slug);
                record(visible ? "Main area restricted" : "Main area published", area.title);
              }}
            />
          );
        })}
      </VisibilityList>
    </AdminPanel>
  );
}
