import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

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
    protected _button: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        this._description = container.querySelector(`.card__text`);
        this._button = ensureElement<HTMLElement>(container);
        this._category = ensureElement<HTMLElement>(`.card__category`, container);
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
        this._id.setAttribute('id', value);
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

    set price(value: string | null) {
        value === null ? this.setText(this._price, 'Бесценно') : this.setText(this._price, value.toLocaleString() + ' синапсов');
    }

    get price(): string | null {
        return this._price.textContent || '';
    }
}
