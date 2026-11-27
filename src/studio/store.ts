import * as React from "react";
import { DEFAULT_PROJECTS, PALETTE_ITEMS, STARTER_TEMPLATES } from "@/studio/defaults";
import {
  isContainerType,
  type DropPosition,
  type LayoutStyle,
  type StarterTemplateId,
  type StudioBlock,
  type StudioBlockProps,
  type StudioBlockType,
  type StudioProject,
} from "@/studio/types";

const STORAGE_KEY = "chilluikit.studio.v3";
const MAX_HISTORY = 40;

function loadInitial(): StudioProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StudioProject[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_PROJECTS;
}

function makeId(prefix = "blk"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function cloneWithNewIds(node: StudioBlock): StudioBlock {
  return {
    ...node,
    id: makeId(),
    layout: node.layout ? { ...node.layout } : undefined,
    props: { ...node.props },
    children: node.children ? node.children.map(cloneWithNewIds) : undefined,
  };
}

function findNode(list: StudioBlock[], id: string): StudioBlock | null {
  for (const b of list) {
    if (b.id === id) return b;
    if (b.children) {
      const found = findNode(b.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function findParentId(
  list: StudioBlock[],
  targetId: string,
  parentId: string | null = null
): string | null {
  for (const b of list) {
    if (b.id === targetId) return parentId;
    if (b.children) {
      const found = findParentId(b.children, targetId, b.id);
      if (found !== undefined && (found !== null || b.children.some((c) => c.id === targetId))) {
        return found;
      }
    }
  }
  return null;
}

function isDescendant(list: StudioBlock[], ancestorId: string, targetId: string): boolean {
  const ancestor = findNode(list, ancestorId);
  if (!ancestor?.children) return false;
  return Boolean(findNode(ancestor.children, targetId));
}

function updateNode(
  list: StudioBlock[],
  id: string,
  updater: (b: StudioBlock) => StudioBlock
): StudioBlock[] {
  return list.map((b) => {
    if (b.id === id) return updater(b);
    if (b.children) return { ...b, children: updateNode(b.children, id, updater) };
    return b;
  });
}

function deleteNode(list: StudioBlock[], id: string): StudioBlock[] {
  return list
    .filter((b) => b.id !== id)
    .map((b) => (b.children ? { ...b, children: deleteNode(b.children, id) } : b));
}

function insertIntoRoot(list: StudioBlock[], block: StudioBlock, index?: number): StudioBlock[] {
  if (index === undefined || index < 0 || index > list.length) return [...list, block];
  const next = [...list];
  next.splice(index, 0, block);
  return next;
}

function insertRelative(
  list: StudioBlock[],
  targetId: string,
  position: DropPosition,
  block: StudioBlock
): StudioBlock[] {
  if (position === "inside") {
    return list.map((b) => {
      if (b.id === targetId) {
        return { ...b, children: [...(b.children ?? []), block] };
      }
      if (b.children) {
        return { ...b, children: insertRelative(b.children, targetId, position, block) };
      }
      return b;
    });
  }

  const idx = list.findIndex((b) => b.id === targetId);
  if (idx !== -1) {
    const next = [...list];
    next.splice(position === "before" ? idx : idx + 1, 0, block);
    return next;
  }

  return list.map((b) =>
    b.children ? { ...b, children: insertRelative(b.children, targetId, position, block) } : b
  );
}

function duplicateInList(list: StudioBlock[], id: string): StudioBlock[] {
  const idx = list.findIndex((b) => b.id === id);
  if (idx !== -1) {
    const copy = cloneWithNewIds(list[idx]);
    const next = [...list];
    next.splice(idx + 1, 0, copy);
    return next;
  }
  return list.map((b) => (b.children ? { ...b, children: duplicateInList(b.children, id) } : b));
}

function moveInList(list: StudioBlock[], id: string, dir: -1 | 1): StudioBlock[] {
  const idx = list.findIndex((b) => b.id === id);
  if (idx !== -1) {
    const target = idx + dir;
    if (target < 0 || target >= list.length) return list;
    const next = [...list];
    const [item] = next.splice(idx, 1);
    next.splice(target, 0, item);
    return next;
  }
  return list.map((b) => (b.children ? { ...b, children: moveInList(b.children, id, dir) } : b));
}

export function useStudioStore() {
  const [projects, setProjects] = React.useState<StudioProject[]>(loadInitial);
  const [past, setPast] = React.useState<StudioProject[][]>([]);
  const [future, setFuture] = React.useState<StudioProject[][]>([]);
  const [projectId, setProjectId] = React.useState<string>(() => loadInitial()[0].id);
  const [pageId, setPageId] = React.useState<string>(() => loadInitial()[0].pages[0].id);
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // ignore storage errors
    }
  }, [projects]);

  const commitProjects = React.useCallback((updater: (prev: StudioProject[]) => StudioProject[]) => {
    setProjects((prev) => {
      const next = updater(prev);
      if (next === prev) return prev;
      setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), prev]);
      setFuture([]);
      return next;
    });
  }, []);

  const undo = React.useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1];
      setProjects((curr) => {
        setFuture((f) => [curr, ...f.slice(0, MAX_HISTORY - 1)]);
        return previous;
      });
      return p.slice(0, -1);
    });
  }, []);

  const redo = React.useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const [next, ...rest] = f;
      setProjects((curr) => {
        setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), curr]);
        return next;
      });
      return rest;
    });
  }, []);

  const activeProject = projects.find((p) => p.id === projectId) ?? projects[0];
  const activePage = activeProject.pages.find((pg) => pg.id === pageId) ?? activeProject.pages[0];
  const selectedBlock = selectedBlockId ? findNode(activePage.blocks, selectedBlockId) : null;

  const updateActivePageBlocks = (updater: (blocks: StudioBlock[]) => StudioBlock[]) => {
    commitProjects((prev) =>
      prev.map((p) =>
        p.id !== activeProject.id
          ? p
          : {
              ...p,
              pages: p.pages.map((pg) =>
                pg.id !== activePage.id ? pg : { ...pg, blocks: updater(pg.blocks) }
              ),
            }
      )
    );
  };

  const selectProject = (id: string) => {
    const found = projects.find((p) => p.id === id);
    if (!found) return;
    setProjectId(id);
    setPageId(found.pages[0]?.id ?? "");
    setSelectedBlockId(null);
  };

  const addProject = (name: string) => {
    const newProj: StudioProject = {
      id: makeId("proj"),
      name,
      pages: [{ id: makeId("page"), name: "Home", blocks: [] }],
    };
    commitProjects((prev) => [...prev, newProj]);
    setProjectId(newProj.id);
    setPageId(newProj.pages[0].id);
    setSelectedBlockId(null);
  };

  const renameProject = (name: string) => {
    commitProjects((prev) => prev.map((p) => (p.id === activeProject.id ? { ...p, name } : p)));
  };

  const addPage = (name: string, templateId: StarterTemplateId = "blank") => {
    const tpl = STARTER_TEMPLATES.find((t) => t.id === templateId);
    const newPage = {
      id: makeId("page"),
      name: name.trim() || `Page ${activeProject.pages.length + 1}`,
      blocks: tpl ? tpl.createBlocks() : [],
    };
    commitProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, pages: [...p.pages, newPage] } : p))
    );
    setPageId(newPage.id);
    setSelectedBlockId(null);
  };

  const renamePage = (id: string, name: string) => {
    commitProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? { ...p, pages: p.pages.map((pg) => (pg.id === id ? { ...pg, name } : pg)) }
          : p
      )
    );
  };

  const deletePage = (id: string) => {
    if (activeProject.pages.length <= 1) return;
    const remaining = activeProject.pages.filter((pg) => pg.id !== id);
    commitProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, pages: remaining } : p))
    );
    if (activePage.id === id) {
      setPageId(remaining[0].id);
      setSelectedBlockId(null);
    }
  };

  const createBlockFromType = (type: StudioBlockType): StudioBlock | null => {
    const tpl = PALETTE_ITEMS.find((i) => i.type === type);
    if (!tpl) return null;
    return {
      id: makeId(),
      type,
      span: tpl.defaultSpan,
      layout: tpl.defaultLayout ? { ...tpl.defaultLayout } : undefined,
      props: { ...tpl.defaultProps },
      children: isContainerType(type) ? [] : undefined,
    };
  };

  const addBlock = (type: StudioBlockType, index?: number, parentId: string | null = null) => {
    const block = createBlockFromType(type);
    if (!block) return;
    updateActivePageBlocks((blocks) =>
      parentId ? insertRelative(blocks, parentId, "inside", block) : insertIntoRoot(blocks, block, index)
    );
    setSelectedBlockId(block.id);
  };

  const addBlockRelative = (
    type: StudioBlockType,
    targetId: string,
    position: DropPosition
  ) => {
    const block = createBlockFromType(type);
    if (!block) return;
    updateActivePageBlocks((blocks) => insertRelative(blocks, targetId, position, block));
    setSelectedBlockId(block.id);
  };

  const updateBlock = (
    id: string,
    patch: {
      span?: StudioBlock["span"];
      layout?: Partial<LayoutStyle>;
      props?: Partial<StudioBlockProps>;
      hidden?: boolean;
    }
  ) => {
    updateActivePageBlocks((blocks) =>
      updateNode(blocks, id, (b) => ({
        ...b,
        span: patch.span ?? b.span,
        hidden: patch.hidden !== undefined ? patch.hidden : b.hidden,
        layout: patch.layout ? { ...b.layout, ...patch.layout } : b.layout,
        props: patch.props ? { ...b.props, ...patch.props } : b.props,
      }))
    );
  };

  const toggleBlockVisibility = (id: string) => {
    updateActivePageBlocks((blocks) =>
      updateNode(blocks, id, (b) => ({ ...b, hidden: !b.hidden }))
    );
  };

  const deleteBlock = (id: string) => {
    updateActivePageBlocks((blocks) => deleteNode(blocks, id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const duplicateBlock = (id: string) => {
    updateActivePageBlocks((blocks) => duplicateInList(blocks, id));
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    updateActivePageBlocks((blocks) => moveInList(blocks, id, dir));
  };

  const moveNodeRelative = (
    sourceId: string,
    targetId: string | null,
    position: DropPosition
  ) => {
    if (sourceId === targetId) return;
    updateActivePageBlocks((blocks) => {
      if (targetId && isDescendant(blocks, sourceId, targetId)) return blocks;
      const node = findNode(blocks, sourceId);
      if (!node) return blocks;
      const without = deleteNode(blocks, sourceId);
      if (!targetId) return insertIntoRoot(without, node);
      return insertRelative(without, targetId, position, node);
    });
  };

  const selectParentBlock = () => {
    if (!selectedBlockId) return;
    const parentId = findParentId(activePage.blocks, selectedBlockId);
    setSelectedBlockId(parentId);
  };

  const importProjectJson = (jsonText: string): { ok: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonText) as StudioProject;
      if (!parsed || typeof parsed.name !== "string" || !Array.isArray(parsed.pages) || parsed.pages.length === 0) {
        return { ok: false, error: "Invalid ChillStudio project JSON." };
      }
      const imported: StudioProject = {
        ...parsed,
        id: makeId("proj"),
      };
      commitProjects((prev) => [...prev, imported]);
      setProjectId(imported.id);
      setPageId(imported.pages[0].id);
      setSelectedBlockId(null);
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not parse JSON file." };
    }
  };

  return {
    projects,
    activeProject,
    activePage,
    selectedBlock,
    selectedBlockId,
    setSelectedBlockId,
    selectParentBlock,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undo,
    redo,
    selectProject,
    addProject,
    renameProject,
    selectPage: (id: string) => {
      setPageId(id);
      setSelectedBlockId(null);
    },
    addPage,
    renamePage,
    deletePage,
    addBlock,
    addBlockRelative,
    updateBlock,
    toggleBlockVisibility,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    moveNodeRelative,
    importProjectJson,
    resetDemo: () => {
      commitProjects(() => DEFAULT_PROJECTS);
      setProjectId(DEFAULT_PROJECTS[0].id);
      setPageId(DEFAULT_PROJECTS[0].pages[0].id);
      setSelectedBlockId(null);
    },
  };
}
