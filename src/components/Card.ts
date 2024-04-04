import {Component} from "./base/Component";
import {ensureElement, createElement, formatNumber} from "../utils/utils";
import {EventEmitter} from "./base/events";
import {IEvents} from "./base/events";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    price: number | null;
    description?: string | string[];
    image: string;
    category: string;
    id: string;
    num: number;
}

export class Card<T> extends Component<ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLElement;
    protected _id: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._id = ensureElement<HTMLElement>(container);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this._id.textContent || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: string | null) {
        value === null ? this.setText(this._price, 'Бесценно') : this.setText(this._price, value.toLocaleString() + ' синапсов');
    }

    get price(): string | null {
        return this._price.textContent || '';
    }
}

export type CatalogItemStatus = {
    description?: string | string[];
    image: string;
    category: string;
    id: string;
};

export class CatalogItem extends Card<CatalogItemStatus> {
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);

        this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
        this._description = container.querySelector(`.card__text`);
        this._category = ensureElement<HTMLElement>(`.card__category`, container);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    get description(): string {
        return this._description.textContent || '';
    }

    set category(value: string) {
        this.setText(this._category, value);
        if (value == 'софт-скил') {
            this._category.classList.add('card__category_soft')
        } else if (value == 'дополнительное') {
            this._category.classList.add('card__category_additional')
        } else if (value == 'кнопка') {
            this._category.classList.add('card__category_button')
        } else if (value == 'другое') {
            this._category.classList.add('card__category_other')
        } else {
            this._category.classList.add('card__category_hard')
        } 
    }

    get category(): string {
        return this._category.textContent || '';
    }
}



export class BasketItem extends Card<ICard> {
    protected _num: HTMLElement;
    protected _button?: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container);

        this._num = ensureElement<HTMLElement>(`.basket__item-index`, container);
        this._button = this.container.querySelector('.basket__item-delete');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }
    
    set num(value: string) {
        this.setText(this._num, value);
    }

    get num(): string | null {
        return this._num.textContent || '';
    }
}