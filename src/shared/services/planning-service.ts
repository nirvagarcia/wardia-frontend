import type {
  IPlanningBoard,
  IPlanningList,
  IPlanningItem,
  IBoardSummary,
  ICloudinaryUploadParams,
  IStorageUsage,
  IPurchaseItemPayload,
} from "@/shared/types/planning";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error ?? `Request failed: ${response.status}`);
  }
  return response.json().then((j: { data: T }) => j.data);
}

async function getBoards(): Promise<IBoardSummary[]> {
  const res = await fetch("/api/planning");
  return handleResponse<IBoardSummary[]>(res);
}

async function getArchivedBoards(): Promise<IBoardSummary[]> {
  const res = await fetch("/api/planning/archived");
  return handleResponse<IBoardSummary[]>(res);
}

async function getBoardDetail(boardId: string): Promise<IPlanningBoard> {
  const res = await fetch(`/api/planning/${boardId}`);
  return handleResponse<IPlanningBoard>(res);
}

async function createBoard(data: { title: string; description?: string; coverImage?: string }): Promise<IPlanningBoard> {
  const res = await fetch("/api/planning", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<IPlanningBoard>(res);
}

async function updateBoard(boardId: string, data: Partial<{ title: string; description: string; coverImage: string | null; order: number }>): Promise<IPlanningBoard> {
  const res = await fetch(`/api/planning/${boardId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<IPlanningBoard>(res);
}

async function deleteBoard(boardId: string): Promise<void> {
  const res = await fetch(`/api/planning/${boardId}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error ?? "Failed to delete board");
  }
}

async function archiveBoard(boardId: string): Promise<IPlanningBoard> {
  const res = await fetch(`/api/planning/${boardId}/archive`, { method: "POST" });
  return handleResponse<IPlanningBoard>(res);
}

async function cloneBoard(boardId: string): Promise<IPlanningBoard> {
  const res = await fetch(`/api/planning/${boardId}/clone`, { method: "POST" });
  return handleResponse<IPlanningBoard>(res);
}

async function toggleShare(boardId: string): Promise<{ shareToken: string | null }> {
  const res = await fetch(`/api/planning/${boardId}/share`, { method: "POST" });
  return handleResponse<{ shareToken: string | null }>(res);
}

async function reorderBoards(items: { id: string; order: number }[]): Promise<void> {
  const res = await fetch("/api/planning/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok && res.status !== 204) throw new Error("Failed to reorder boards");
}

async function createList(boardId: string, data: { title: string; description?: string }): Promise<IPlanningList> {
  const res = await fetch(`/api/planning/${boardId}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<IPlanningList>(res);
}

async function updateList(boardId: string, listId: string, data: Partial<{ title: string; description: string }>): Promise<IPlanningList> {
  const res = await fetch(`/api/planning/${boardId}/lists/${listId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<IPlanningList>(res);
}

async function deleteList(boardId: string, listId: string): Promise<void> {
  const res = await fetch(`/api/planning/${boardId}/lists/${listId}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error ?? "Failed to delete list");
  }
}

async function archiveList(boardId: string, listId: string): Promise<IPlanningList> {
  const res = await fetch(`/api/planning/${boardId}/lists/${listId}/archive`, { method: "POST" });
  return handleResponse<IPlanningList>(res);
}

async function completeList(boardId: string, listId: string): Promise<IPlanningList> {
  const res = await fetch(`/api/planning/${boardId}/lists/${listId}/complete`, { method: "POST" });
  return handleResponse<IPlanningList>(res);
}

async function reorderLists(boardId: string, items: { id: string; order: number }[]): Promise<void> {
  const res = await fetch(`/api/planning/${boardId}/lists/reorder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok && res.status !== 204) throw new Error("Failed to reorder lists");
}

async function createItem(
  boardId: string,
  listId: string,
  data: Partial<IPlanningItem> & { title: string; links?: { label?: string; url: string }[] }
): Promise<IPlanningItem> {
  const res = await fetch(`/api/planning/${boardId}/lists/${listId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<IPlanningItem>(res);
}

async function updateItem(
  boardId: string,
  listId: string,
  itemId: string,
  data: Partial<IPlanningItem> & { links?: { label?: string; url: string }[] }
): Promise<IPlanningItem> {
  const res = await fetch(`/api/planning/${boardId}/lists/${listId}/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<IPlanningItem>(res);
}

async function deleteItem(boardId: string, listId: string, itemId: string): Promise<void> {
  const res = await fetch(`/api/planning/${boardId}/lists/${listId}/items/${itemId}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error ?? "Failed to delete item");
  }
}

async function purchaseItem(boardId: string, listId: string, itemId: string, data: IPurchaseItemPayload): Promise<IPlanningItem> {
  const res = await fetch(`/api/planning/${boardId}/lists/${listId}/items/${itemId}/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<IPlanningItem>(res);
}

async function reorderItems(boardId: string, listId: string, items: { id: string; order: number }[]): Promise<void> {
  const res = await fetch(`/api/planning/${boardId}/lists/${listId}/items/reorder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok && res.status !== 204) throw new Error("Failed to reorder items");
}

async function getUploadParams(): Promise<ICloudinaryUploadParams> {
  const res = await fetch("/api/planning/upload-url", { method: "POST" });
  return handleResponse<ICloudinaryUploadParams>(res);
}

async function uploadToCloudinary(file: File, params: ICloudinaryUploadParams): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", params.apiKey);
  formData.append("timestamp", String(params.timestamp));
  formData.append("signature", params.signature);
  formData.append("folder", params.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${params.cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}

async function fetchOgImage(url: string): Promise<string | null> {
  const res = await fetch("/api/planning/og-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await handleResponse<{ imageUrl: string | null }>(res);
  return data.imageUrl;
}

async function getStorageUsage(): Promise<IStorageUsage> {
  const res = await fetch("/api/planning/storage-usage");
  return handleResponse<IStorageUsage>(res);
}

async function getSharedBoard(shareToken: string): Promise<IPlanningBoard> {
  const res = await fetch(`/api/planning/shared/${shareToken}`);
  return handleResponse<IPlanningBoard>(res);
}

export const planningService = {
  getBoards,
  getArchivedBoards,
  getBoardDetail,
  createBoard,
  updateBoard,
  deleteBoard,
  archiveBoard,
  cloneBoard,
  toggleShare,
  reorderBoards,
  createList,
  updateList,
  deleteList,
  archiveList,
  completeList,
  reorderLists,
  createItem,
  updateItem,
  deleteItem,
  purchaseItem,
  reorderItems,
  getUploadParams,
  uploadToCloudinary,
  fetchOgImage,
  getStorageUsage,
  getSharedBoard,
};
