export interface ICard {
    id: string;
    title: string;
    description?: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IOrderForm {
    address: string;
    payment: string;
}

export interface IOrder extends IOrderForm {
    items: string[],
    total: number,
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface IOrderFull extends IOrder, IContactsForm {

}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export type FormContactsErrors = Partial<Record<keyof IContactsForm, string>>;

export interface IAppState {
    catalog: ICard[];
    basket: string[];
    preview: string | null;
    order: IOrderForm | null;
    contacts: IContactsForm | null;
    orderFull: IOrderFull | null;
}

export interface IOrderResult {
    id: string;
}