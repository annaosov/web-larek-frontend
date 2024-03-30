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
    price: string;
    category: string;

    protected myLastBid: number = 0;

    clearBid() {
        this.myLastBid = 0;
    }

    get isParticipate(): boolean {
        return this.myLastBid !== 0;
    }
}

export class AppState extends Model<IAppState> {
    basket: string[];
    catalog: CardItem[];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};

    setCatalog(items: ICard[]) {
        this.catalog = items.map(item => new CardItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }
}