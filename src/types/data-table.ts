export type SearchParams = Record<string, string | string[] | undefined>;

export type Option = {
    label: string;
    value: string | number | boolean;
    icon?: React.ComponentType<{ className?: string }>;
};

export interface DataTableFilterOption<TData> {
    id?: string;
    label: string;
    value: keyof TData | string;
    items: Option[];
    isMulti?: boolean;
}

export interface DataTableSearchableColumn<TData> {
    id: keyof TData;
    placeholder?: string;
}

export interface DataTableFilterableColumn<TData> {
    id: keyof TData;
    title: string;
    options: Option[];
}

export interface DataTableHistoryData {
  id: string;
  createdAt: string;
  contentType: "carrossel" | "reels" | "post" | "legenda";
  content: JSON;
};
