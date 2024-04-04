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

    constructor(container: HTMLFormElement, events: IEvents, actions?: TabActions) {
        super(container, events);

        this._button = this.container.querySelector('.order__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('contacts:open');
            });
        }

        this._buttons = ensureAllElements<HTMLButtonElement>('.button', container);

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                actions?.onClick?.(button.name);
            });
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
/*
    set payment(name: string) {
        this._buttons.forEach(button => {
            this.toggleClass(button, 'tabs__item_active', button.name === name);
            (this.container.elements.namedItem('payment') as HTMLElement).value = online;
            this.setDisabled(button, button.name === name)
        });
    }
    */
}