import {Form} from "./common/Form";
import {IContactsForm} from "../types";
import {IEvents} from "./base/events";

export class Contacts extends Form<IContactsForm> {
    protected _button: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._button = this.container.querySelector('.button');
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set selected(disabled: boolean) {
        if (disabled === false) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }
}