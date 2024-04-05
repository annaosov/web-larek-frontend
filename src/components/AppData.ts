import {Model} from "./base/Model";
import {FormErrors, FormContactsErrors, IAppState, ICard, IOrderFull, IOrder, IContactsForm, IOrderForm} from "../types";

export type CatalogChangeEvent = {
    catalog: CardItem[]
};

export class CardItem extends Model<ICard> {
    description: string;
    id: string;
    image: string;
    title: string;
    price: number;
    category: string;
    num: number;
}

export class AppState extends Model<IAppState> {
    catalog: CardItem[];
    loading: boolean;
    contacts: IContactsForm = {
        email: '',
        phone: '',
    };
    order: IOrder = {
        address: '',
        payment: '',
        items: [],
        total: 0,
    };

    orderFull: IOrderFull = {
        address: '',
        payment: '',
        email: '',
        phone: '',
        total: 0,
        items: [],
    }

    preview: string | null;
    formErrors: FormErrors = {};
    formContactsErrors: FormContactsErrors = {};
    basket: CardItem[] = [];

    setCatalog(items: ICard[]) {
        this.catalog = items.map(item => new CardItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: CardItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        this.orderFull[field] += this.order[field];
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }
    setContactsField(field: keyof IContactsForm, value: string) {
        this.contacts[field] = value;
        this.orderFull[field] += this.contacts[field];
        if (this.validateContacts()) {
            this.events.emit('contacts:ready', this.contacts);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContacts() {
        const errors: typeof this.formContactsErrors = {};
        if (!this.contacts.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.contacts.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formContactsErrors = errors;
        this.events.emit('FormContactsErrors:change', this.formContactsErrors);
        return Object.keys(errors).length === 0;
    }

    clearBasket() {
        console.log('очищ корз')
        this.orderFull.items = [];
        this.orderFull.total = 0;
        this.basket = [];
    }

    getTotal() {
        return this.basket.reduce((a, c) => a + this.basket.find(it => it.id === c.id).price, 0)
    }

    getAddedToBasket(item: CardItem): CardItem[] {
        this.basket.push(item);
        this.orderFull.items.push(item.id);
        this.orderFull.total += item.price;
        item.num = this.basket.indexOf(item) + 1;
        return this.basket;
    }

    getDeletedFromBasket(item: CardItem): CardItem[] {
        this.basket.splice(this.basket.indexOf(item), 1);
        this.orderFull.items.splice(this.orderFull.items.indexOf(item.id), 1);
        this.orderFull.total = this.orderFull.total - item.price;
        return this.basket;
    }
}