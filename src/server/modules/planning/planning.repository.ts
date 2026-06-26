import { prisma } from "@/server/db/client";
import { randomUUID } from "crypto";
import type { BoardCreateInput, BoardUpdateInput, ListCreateInput, ListUpdateInput, ItemCreateInput, ItemUpdateInput } from "./planning.validation";

export function findBoardsByUser(userId: string, archived = false) {
  return prisma.planningBoard.findMany({
    where: { userId, archived },
    orderBy: { order: "asc" },
    include: {
      lists: {
        where: { archived: false },
        include: {
          items: { select: { id: true, status: true, priceValue: true, priceCurrency: true, quantity: true } },
        },
        orderBy: { order: "asc" },
      },
    },
  });
}

export function findBoardById(id: string, userId: string) {
  return prisma.planningBoard.findFirst({
    where: { id, userId },
    include: {
      lists: {
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
            include: { links: true },
          },
        },
      },
    },
  });
}

export function findBoardByShareToken(shareToken: string) {
  return prisma.planningBoard.findUnique({
    where: { shareToken },
    include: {
      lists: {
        where: { archived: false },
        orderBy: { order: "asc" },
        include: {
          items: {
            where: { status: "pending" },
            orderBy: { order: "asc" },
            include: { links: true },
          },
        },
      },
    },
  });
}

export function createBoard(userId: string, data: BoardCreateInput) {
  return prisma.planningBoard.create({ data: { ...data, userId } });
}

export function updateBoard(id: string, data: BoardUpdateInput) {
  return prisma.planningBoard.update({ where: { id }, data });
}

export function archiveBoard(id: string, archived: boolean) {
  return prisma.planningBoard.update({ where: { id }, data: { archived } });
}

export function deleteBoard(id: string) {
  return prisma.planningBoard.delete({ where: { id } });
}

export async function toggleBoardShare(id: string, currentToken: string | null) {
  const shareToken = currentToken ? null : randomUUID();
  return prisma.planningBoard.update({ where: { id }, data: { shareToken } });
}

export async function cloneBoard(sourceId: string, userId: string) {
  const source = await prisma.planningBoard.findFirst({
    where: { id: sourceId, userId },
    include: {
      lists: {
        include: { items: { include: { links: true } } },
      },
    },
  });
  if (!source) return null;

  const maxOrder = await prisma.planningBoard.count({ where: { userId } });

  return prisma.planningBoard.create({
    data: {
      userId,
      title: `${source.title} (copia)`,
      description: source.description ?? undefined,
      coverImage: source.coverImage ?? undefined,
      order: maxOrder,
      lists: {
        create: source.lists.map((list) => ({
          title: list.title,
          description: list.description ?? undefined,
          order: list.order,
          items: {
            create: list.items.map((item) => ({
              title: item.title,
              description: item.description ?? undefined,
              imageUrl: item.imageUrl ?? undefined,
              priceValue: item.priceValue ?? undefined,
              priceCurrency: item.priceCurrency,
              priority: item.priority,
              status: "pending",
              tags: item.tags,
              notes: item.notes ?? undefined,
              order: item.order,
              links: { create: item.links.map((l) => ({ label: l.label ?? undefined, url: l.url })) },
            })),
          },
        })),
      },
    },
  });
}

export async function reorderBoards(userId: string, items: { id: string; order: number }[]) {
  await prisma.$transaction(
    items.map(({ id, order }) =>
      prisma.planningBoard.update({ where: { id, userId }, data: { order } })
    )
  );
}


export function createList(boardId: string, data: ListCreateInput) {
  return prisma.planningList.create({ data: { ...data, boardId } });
}

export function findListById(id: string) {
  return prisma.planningList.findUnique({ where: { id }, include: { board: true } });
}

export function updateList(id: string, data: ListUpdateInput) {
  return prisma.planningList.update({ where: { id }, data });
}

export function archiveList(id: string, archived: boolean) {
  return prisma.planningList.update({ where: { id }, data: { archived } });
}

export function deleteList(id: string) {
  return prisma.planningList.delete({ where: { id } });
}

export async function completeList(id: string) {
  await prisma.planningItem.updateMany({
    where: { listId: id, status: "pending" },
    data: { status: "purchased", purchasedAt: new Date() },
  });
  return prisma.planningList.update({ where: { id }, data: { archived: true } });
}

export async function reorderLists(boardId: string, items: { id: string; order: number }[]) {
  await prisma.$transaction(
    items.map(({ id, order }) =>
      prisma.planningList.update({ where: { id, boardId }, data: { order } })
    )
  );
}

export function createItem(listId: string, data: ItemCreateInput) {
  const { links, ...itemData } = data;
  return prisma.planningItem.create({
    data: {
      ...itemData,
      listId,
      imageUrl: itemData.imageUrl ?? undefined,
      priceValue: itemData.priceValue ?? undefined,
      links: { create: links.map((l) => ({ label: l.label, url: l.url })) },
    },
    include: { links: true },
  });
}

export function findItemById(id: string) {
  return prisma.planningItem.findUnique({ where: { id }, include: { links: true, list: { include: { board: true } } } });
}

export async function updateItem(id: string, data: ItemUpdateInput) {
  const { links, ...itemData } = data;
  await prisma.planningItemLink.deleteMany({ where: { itemId: id } });
  return prisma.planningItem.update({
    where: { id },
    data: {
      ...itemData,
      imageUrl: itemData.imageUrl ?? undefined,
      priceValue: itemData.priceValue ?? undefined,
      links: links ? { create: links.map((l) => ({ label: l.label, url: l.url })) } : undefined,
    },
    include: { links: true },
  });
}

export function purchaseItem(id: string, purchasedAt: Date, priceValue?: number | null, priceCurrency?: string) {
  return prisma.planningItem.update({
    where: { id },
    data: {
      status: "purchased",
      purchasedAt,
      ...(priceValue !== undefined && { priceValue }),
      ...(priceCurrency && { priceCurrency }),
    },
    include: { links: true },
  });
}

export function deleteItem(id: string) {
  return prisma.planningItem.delete({ where: { id } });
}

export async function reorderItems(listId: string, items: { id: string; order: number }[]) {
  await prisma.$transaction(
    items.map(({ id, order }) =>
      prisma.planningItem.update({ where: { id, listId }, data: { order } })
    )
  );
}
