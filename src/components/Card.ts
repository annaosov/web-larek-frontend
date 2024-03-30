import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";

export interface ICard {
    title: string;
    description?: string | string[];
    image: string;
    category: string;
    price: string | null;
    id: string;
}

export class Card<T> extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;
    protected _id: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        this._description = container.querySelector(`.card__description`);
        this._category = ensureElement<HTMLElement>(`.card__category`, container);
        this._id = container;
    }

    set id(value: string) {
        this._id.setAttribute('id', value);
        console.log(this._id);
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

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
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

    set price(value: string | null) {
        value === null ? this.setText(this._price, 'Бесценно') : this.setText(this._price, value.toLocaleString() + ' синапсов');
    }

    get price(): string | null {
        return this._price.textContent || '';
    }
}