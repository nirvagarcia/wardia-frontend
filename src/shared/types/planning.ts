export type ItemStatus = "pending" | "purchased";
export type ItemPriority = "low" | "medium" | "high";
export type PlanningCurrency = "PEN" | "USD" | "EUR";

export interface IPlanningItemLink {
  id: string;
  itemId: string;
  label?: string;
  url: string;
}

export interface IPlanningItem {
  id: string;
  listId: string;
  title: string;
  description?: string;
  imageUrl?: string | null;
  priceValue?: number | null;
  priceCurrency: PlanningCurrency;
  quantity: number;
  priority: ItemPriority;
  status: ItemStatus;
  tags: string[];
  notes?: string;
  purchasedAt?: string | null;
  order: number;
  links: IPlanningItemLink[];
  createdAt: string;
  updatedAt: string;
}

export interface IPlanningListStats {
  total: number;
  purchased: number;
  estimatedTotal: number;
  currency: PlanningCurrency;
}

export interface IPlanningList {
  id: string;
  boardId: string;
  title: string;
  description?: string;
  order: number;
  archived: boolean;
  items: IPlanningItem[];
  createdAt: string;
  updatedAt: string;
}

export interface IBoardStats {
  totalItems: number;
  purchasedItems: number;
  estimatedTotal: number;
  purchasedTotal: number;
  percentPurchased: number;
  currency: PlanningCurrency;
}

export interface IPlanningBoard {
  id: string;
  userId: string;
  title: string;
  description?: string;
  coverImage?: string | null;
  order: number;
  archived: boolean;
  shareToken?: string | null;
  lists: IPlanningList[];
  createdAt: string;
  updatedAt: string;
}

export interface IBoardSummaryItem {
  id: string;
  status: ItemStatus;
  priceValue?: number | null;
  priceCurrency: PlanningCurrency;
  quantity: number;
}

export interface IBoardSummaryList {
  id: string;
  title: string;
  items: IBoardSummaryItem[];
}

export interface IBoardSummary extends Omit<IPlanningBoard, "lists"> {
  lists: IBoardSummaryList[];
}

export interface ICloudinaryUploadParams {
  signature: string;
  timestamp: number;
  folder: string;
  cloudName: string;
  apiKey: string;
  storageWarning: boolean;
}

export interface IStorageUsage {
  usedMB: number;
  totalMB: number;
  usedPercent: number;
}

export interface IPurchaseItemPayload {
  purchasedAt: string;
  priceValue?: number | null;
  priceCurrency?: PlanningCurrency;
  createTransaction: boolean;
  transactionData?: {
    accountId?: string;
    cardId?: string;
    category: string;
    notes?: string;
  };
}
