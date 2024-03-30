import { Api, ApiListResponse } from './base/api';
import {ICard} from "../types";

export interface ICardAPI {
    getCardList: () => Promise<ICard[]>;
}

export class CardAPI extends Api implements ICardAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardList(): Promise<ICard[]> {
        return this.get('/product').then((data: ApiListResponse<ICard>) =>    
        data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
                
            }))
        );
    }

}