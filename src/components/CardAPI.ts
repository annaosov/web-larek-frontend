import { Api, ApiListResponse } from './base/api';
import {ICard, IOrder, IOrderFull, IOrderResult} from "../types";

export interface ICardAPI {
    getCardList: () => Promise<ICard[]>;
    orderLots: (orderFull: IOrder) => Promise<IOrderResult>;
}

export class CardAPI extends Api implements ICardAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardItem(id: string): Promise<ICard> {
        return this.get(`/product/${id}`).then(
            (item: ICard) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getCardList(): Promise<ICard[]> {
        return this.get('/product').then((data: ApiListResponse<ICard>) =>    
        data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
                
            }))
        );
    }

    orderLots(orderFull: IOrderFull): Promise<IOrderResult> {
        return this.post('/order', orderFull).then(
            (data: IOrderResult) => data
        );
    }
}