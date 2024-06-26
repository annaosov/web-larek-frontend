import './scss/styles.scss';
import {CardAPI} from "./components/CardAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {AppState, CatalogChangeEvent, CardItem} from "./components/AppData";
import {Page} from "./components/Page";
import {CatalogItem, BasketItem} from "./components/Card";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {EventEmitter} from "./components/base/events";
import {Basket} from "./components/common/Basket";
import {Order} from "./components/Order";
import {Contacts} from "./components/Contacts";
import {IOrderForm, IContactsForm} from "./types";
import {Success} from "./components/common/Success";

const events = new EventEmitter();
const api = new CardAPI(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
        });
    });
});

events.on('card:select', (item: CardItem) => {
    appData.setPreview(item);
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
    api.orderProducts(appData.orderFull)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                }
            });
            success.total = appData.getTotal();
            appData.clearBasket();
            basket.items = [];
            page.counter = 0;
            basket.total = 0;
            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { address, payment } = errors;
    order.valid = !address && !payment;
    order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
});


// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Открыть форму заказа
events.on('order:open', () => {
    modal.render({
        content: order.render({
            address: '',
            payment: '',
            valid: false,
            errors: []
        })
    });
    if (order.address = appData.order.address) {
        if (order.payment = appData.order.payment) {
        order.selected = false;
        }
    }
});

// Изменилось состояние валидации формы
events.on('formContactsErrors:change', (errors: Partial<IContactsForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^contacts\..*:change/, (data: { field: keyof IContactsForm, value: string }) => {
    appData.setContactsField(data.field, data.value);
});

// Открыть форму контактов
events.on('contacts:open', () => {
    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
    if (contacts.phone = appData.contacts.phone) {
        if (contacts.email = appData.contacts.email) {
            contacts.selected = false;
        }
    }
});

// Открыть корзину
events.on('basket:open', () => {
    basket.selected = appData.orderFull.items;
    modal.render({
        content: basket.render()
    });
});

// Добавление в корзину
events.on('basket:add', (item: CardItem) => {
    basket.items = appData.getAddedToBasket(item).map(item => {
        const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                events.emit('basket:delete', item);  
            }
        });
        return card.render({
            title: item.title,
            price: item.price,
            num: item.num,
        });
    });
    page.counter = appData.basket.length;
    basket.total = appData.getTotal();
    basket.selected = appData.orderFull.items;
});

// Удаление из корзины
events.on('basket:delete', (item: CardItem) => {
    basket.items = appData.getDeletedFromBasket(item).map(item => {
        const card = new BasketItem(cloneTemplate(cardBasketTemplate));
        return card.render({
            title: item.title,
            price: item.price,
            num: item.num,
        });
    });
    page.counter = appData.basket.length;
    basket.total = appData.getTotal();
    basket.selected = appData.orderFull.items;
});

// Изменена открытая выбранная карточка
events.on('preview:changed', (item: CardItem) => {
    const showItem = (item: CardItem) => {
        const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
            onClick: () => {
                    events.emit('basket:add', item);
                    modal.close();
            }
        });
        if (appData.basket && appData.basket.length !== 0) {
            appData.basket.forEach(it => {
                if (appData.basket.find(it => it.id === item.id)) {
                    card.selected = true;
                }
            });
        }
        if (item.price === null) {
            card.selected = true;
        }
        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                description: item.description.split("\n"),
                category: item.category,
                price: item.price,
            })
        });
    };

    if (item) {
        api.getCardItem(item.id)
            .then((result) => {
                item.description = result.description;
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

// Получаем product list с сервера
api.getCardList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });