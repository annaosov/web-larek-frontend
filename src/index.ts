import './scss/styles.scss';
import {CardAPI} from "./components/CardAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {AppState, CatalogChangeEvent} from "./components/AppData";
import {Page} from "./components/Page";
import {Card} from "./components/Card";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {EventEmitter} from "./components/base/events";

const events = new EventEmitter();
const api = new CardAPI(CDN_URL, API_URL);

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate));
        return card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            category: item.category,
            price: item.price,
            id: item.id,
        });
    });
});

// Получаем product list с сервера
api.getCardList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });