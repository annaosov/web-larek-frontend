export interface ICard {
    id: string;
    title: string;
    description?: string;
    image: string;
    category: string;
    price: string | null;
}

export interface IOrderForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
    catalog: ICard[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}