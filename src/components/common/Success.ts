import {Component} from "../base/Component";
import {ensureElement, formatNumber} from "../../utils/utils";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _closeModal: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = this.container.querySelector('.order-success__description');
        this._closeModal = document.querySelector('.modal__close');

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
            this._closeModal.addEventListener('click', actions.onClick);
        }
    }

    set total(total: number) {
        this.setText(this._total, 'Списано ' + formatNumber(total) + ' синапсов');
    }
}