import { ApiError } from "@/server/lib/api-error";
import * as repo from "./planning.repository";
import type { BoardCreateInput, BoardUpdateInput, ListCreateInput, ListUpdateInput, ItemCreateInput, ItemUpdateInput, PurchaseItemInput } from "./planning.validation";

export async function getBoards(userId: string) {
  return repo.findBoardsByUser(userId, false);
}

export async function getArchivedBoards(userId: string) {
  return repo.findBoardsByUser(userId, true);
}

export async function getBoardDetail(id: string, userId: string) {
  const board = await repo.findBoardById(id, userId);
  if (!board) throw new ApiError("Board not found", 404);
  return board;
}

export async function getSharedBoard(shareToken: string) {
  const board = await repo.findBoardByShareToken(shareToken);
  if (!board) throw new ApiError("Board not found", 404);
  return board;
}

export async function createBoard(userId: string, data: BoardCreateInput) {
  const count = await countBoardsByUser(userId);
  return repo.createBoard(userId, { ...data, order: data.order ?? count });
}

async function countBoardsByUser(userId: string) {
  const { prisma } = await import("@/server/db/client");
  return prisma.planningBoard.count({ where: { userId } });
}

export async function updateBoard(id: string, userId: string, data: BoardUpdateInput) {
  const existing = await repo.findBoardById(id, userId);
  if (!existing) throw new ApiError("Board not found", 404);
  return repo.updateBoard(id, data);
}

export async function deleteBoard(id: string, userId: string) {
  const existing = await repo.findBoardById(id, userId);
  if (!existing) throw new ApiError("Board not found", 404);
  await repo.deleteBoard(id);
}

export async function archiveBoard(id: string, userId: string) {
  const existing = await repo.findBoardById(id, userId);
  if (!existing) throw new ApiError("Board not found", 404);
  return repo.archiveBoard(id, !existing.archived);
}

export async function toggleShare(id: string, userId: string) {
  const existing = await repo.findBoardById(id, userId);
  if (!existing) throw new ApiError("Board not found", 404);
  return repo.toggleBoardShare(id, existing.shareToken);
}

export async function cloneBoard(id: string, userId: string) {
  const cloned = await repo.cloneBoard(id, userId);
  if (!cloned) throw new ApiError("Board not found", 404);
  return cloned;
}

export async function reorderBoards(userId: string, items: { id: string; order: number }[]) {
  await repo.reorderBoards(userId, items);
}


async function requireBoardAccess(boardId: string, userId: string) {
  const board = await repo.findBoardById(boardId, userId);
  if (!board) throw new ApiError("Board not found", 404);
  return board;
}

export async function createList(boardId: string, userId: string, data: ListCreateInput) {
  await requireBoardAccess(boardId, userId);
  return repo.createList(boardId, data);
}

export async function updateList(listId: string, userId: string, data: ListUpdateInput) {
  const list = await repo.findListById(listId);
  if (!list || list.board.userId !== userId) throw new ApiError("List not found", 404);
  return repo.updateList(listId, data);
}

export async function deleteList(listId: string, userId: string) {
  const list = await repo.findListById(listId);
  if (!list || list.board.userId !== userId) throw new ApiError("List not found", 404);
  await repo.deleteList(listId);
}

export async function archiveList(listId: string, userId: string) {
  const list = await repo.findListById(listId);
  if (!list || list.board.userId !== userId) throw new ApiError("List not found", 404);
  return repo.archiveList(listId, !list.archived);
}

export async function completeList(listId: string, userId: string) {
  const list = await repo.findListById(listId);
  if (!list || list.board.userId !== userId) throw new ApiError("List not found", 404);
  return repo.completeList(listId);
}

export async function reorderLists(boardId: string, userId: string, items: { id: string; order: number }[]) {
  await requireBoardAccess(boardId, userId);
  await repo.reorderLists(boardId, items);
}

async function requireItemAccess(itemId: string, userId: string) {
  const item = await repo.findItemById(itemId);
  if (!item || item.list.board.userId !== userId) throw new ApiError("Item not found", 404);
  return item;
}

export async function createItem(listId: string, boardId: string, userId: string, data: ItemCreateInput) {
  await requireBoardAccess(boardId, userId);
  return repo.createItem(listId, data);
}

export async function updateItem(itemId: string, userId: string, data: ItemUpdateInput) {
  await requireItemAccess(itemId, userId);
  return repo.updateItem(itemId, data);
}

export async function deleteItem(itemId: string, userId: string) {
  await requireItemAccess(itemId, userId);
  await repo.deleteItem(itemId);
}

export async function purchaseItem(itemId: string, userId: string, data: PurchaseItemInput) {
  await requireItemAccess(itemId, userId);
  const purchasedAt = new Date(data.purchasedAt);
  return repo.purchaseItem(itemId, purchasedAt, data.priceValue, data.priceCurrency);
}

export async function reorderItems(listId: string, boardId: string, userId: string, items: { id: string; order: number }[]) {
  await requireBoardAccess(boardId, userId);
  await repo.reorderItems(listId, items);
}
