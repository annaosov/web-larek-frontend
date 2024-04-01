import {Model} from "./base/Model";
import {FormErrors, IAppState, ICard, IOrder} from "../types";

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
    history: number[];
    num: number;
}

export class AppState extends Model<IAppState> {

    catalog: CardItem[];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};

    basket: CardItem[] = [];

    setCatalog(items: ICard[]) {
        this.catalog = items.map(item => new CardItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: CardItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }
/*
    clearBasket() {
        this.order.items.forEach(id => {
            this.toggleOrderedLot(id, false);
            this.catalog.find(it => it.id === id).clearBid();
        });
    }
    */
    getTotal() {
        return this.basket.reduce((a, c) => a + this.basket.find(it => it.id === c.id).price, 0)
    }

    getActiveLots(item: CardItem): CardItem[] {
        if (this.basket.length !== 0) {
            this.basket.forEach(it => {
                if (this.basket.find(it => it.id === item.id)) {
                    return;
                } else {
                    this.basket.push(item);
                    item.num = this.basket.indexOf(item) + 1;
                }
            })
        } else {
            this.basket.push(item);
            item.num = this.basket.indexOf(item) + 1;
        }
        return this.basket;
    }
}