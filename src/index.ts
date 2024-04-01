import './scss/styles.scss';
import {CardAPI} from "./components/CardAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {AppState, CatalogChangeEvent, CardItem} from "./components/AppData";
import {Page} from "./components/Page";
import {CatalogItem, BidItem} from "./components/Card";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {EventEmitter} from "./components/base/events";
import {Basket} from "./components/common/Basket";

const events = new EventEmitter();
const api = new CardAPI(CDN_URL, API_URL);


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const bidsTemplate = ensureElement<HTMLTemplateElement>('#basket');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const bids = new Basket(cloneTemplate(bidsTemplate), events);

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
            id: item.id,
        });
    });
});

// Открыть карточку
events.on('card:select', (item: CardItem) => {
    appData.setPreview(item);
});

// Открыть корзину
events.on('basket:open', () => {
    modal.render({
        content: bids.render()
    });
});

// Изменения в корзине
events.on('basket:changed', (item: CardItem) => {
    bids.items = appData.getActiveLots(item).map(item => {
        const card = new BidItem(cloneTemplate(cardBasketTemplate));
        bids.total = appData.getTotal();
        return card.render({
            title: item.title,
            price: item.price,
            num: item.num,
        });
    });
});

// Изменена открытая выбранная карточка
events.on('preview:changed', (item: CardItem) => {
    const showItem = (item: CardItem) => {
        const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
            onClick: () => events.emit('basket:changed', item)
        });
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

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем product list с сервера
api.getCardList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });