import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {IEvents} from "./base/events";
import {ensureAllElements} from "../utils/utils";

export type TabActions = {
    onClick: (tab: string) => void
}

export class Order extends Form<IOrderForm> {
    protected _button: HTMLButtonElement;
    protected _buttons: HTMLButtonElement[];
    protected _buttonCard: HTMLButtonElement;
    protected _buttonCash: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents, actions?: TabActions) {
        super(container, events);

        this._button = this.container.querySelector('.order__button');
        this._buttonCard = this.container.querySelector('button[name="card"]');
        this._buttonCash = this.container.querySelector('button[name="cash"]');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('contacts:open');
                this._buttonCash.classList.remove('button_alt-active');
                this._buttonCard.classList.remove('button_alt-active');
            });
        };

        this._buttonCard.addEventListener('click', () => {
            this.toggleClass(this._buttonCard, 'button_alt-active');
            this._buttonCash.classList.remove('button_alt-active');
        });

        this._buttonCash.addEventListener('click', () => {
            this.toggleClass(this._buttonCash, 'button_alt-active');
            this._buttonCard.classList.remove('button_alt-active');
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set payment(value: string) {
        if (value === 'card') {
            this._buttonCard.classList.add('button_alt-active');
        } else if (value === 'cash') {
            this._buttonCash.classList.add('button_alt-active');
        }
    }

    set selected(disabled: boolean) {
        if (disabled === false) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }
}