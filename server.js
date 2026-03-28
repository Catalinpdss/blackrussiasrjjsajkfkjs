const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const HOST = `https://blackrussiasrjjsajkfkjs.onrender.com`;

app.use(cors());
app.use(express.json());
app.use('/cdn', express.static(path.join(__dirname, 'cdn')));

// --- ПОЛНЫЕ ДАННЫЕ ДЛЯ ВСЕХ ЭНДПОИНТОВ ---

const appConfig = {
    "version": "16.21.0",
    "cdn_url": `${HOST}/cdn/`,
    "is_maintenance": false,
    "news": [
        {"id": 1, "title": "Новый бэкенд!", "text": "Добро пожаловать в игру.", "image": `${HOST}/cdn/news1.png`, "url": "https://vk.com/br_dev"}
    ]
};

const servers = [
    {"id": 1, "name": "RED", "ip": "127.0.0.1", "port": 7777, "online": 100, "max_online": 1000, "color": "#FF0000"},
    {"id": 2, "name": "GREEN", "ip": "127.0.0.1", "port": 7778, "online": 50, "max_online": 1000, "color": "#00FF00"}
];

const vehicles = [
    {"id": 411, "modelId": 411, "name": "Infernus", "nameStore": "Infernus S", "price": 1000000, "imageName": "411", "speed": 220},
    {"id": 541, "modelId": 541, "name": "Bullet", "nameStore": "Bullet", "price": 800000, "imageName": "541", "speed": 210}
];

const donateItems = {
    "array": [
        {
            "id": 1,
            "name": "Валюта",
            "items": [
                {"id": 101, "name": "1,000,000 руб", "price": 500, "imageName": "money_pack"},
                {"id": 102, "name": "5,000,000 руб", "price": 2000, "imageName": "money_pack_large"}
            ]
        },
        {
            "id": 2,
            "name": "Транспорт",
            "items": [
                {"id": 201, "name": "Infernus", "price": 5000, "imageName": "411"}
            ]
        }
    ]
};

const blackPass = {
    "season": 5,
    "properties": {"seasonColor": "#FFD700"},
    "standardLevel": [
        {"level": 1, "rewardId": 1, "rewardType": "money", "count": 50000},
        {"level": 2, "rewardId": 101, "rewardType": "skin", "count": 1}
    ],
    "premiumLevel": [
        {"level": 1, "rewardId": 411, "rewardType": "car", "count": 1},
        {"level": 2, "rewardId": 500, "rewardType": "bc", "count": 100}
    ],
    "deluxeRewards": [
        {"id": 1, "name": "Эксклюзивный скин", "imageName": "skin_deluxe"}
    ]
};

const spawnLocations = {
    "locations": [
        {"id": 1, "name": "Вокзал Арзамас", "x": 100.0, "y": 200.0, "z": 10.0},
        {"id": 2, "name": "Вокзал Батырево", "x": -100.0, "y": -500.0, "z": 5.0}
    ]
};

// Роутер
const r = express.Router();

r.get('/app-config.json', (req, res) => res.json(appConfig));
r.get('/servers.json', (req, res) => res.json(servers));
r.get('/vehicles.json', (req, res) => res.json(vehicles));
r.get('/donate-items.json', (req, res) => res.json(donateItems));
r.get('/black-pass.json', (req, res) => res.json(blackPass));
r.get('/spawnLocation.json', (req, res) => res.json(spawnLocations));
r.get('/app_info.json', (req, res) => res.json({"version": "16.21.0", "url": `${HOST}/cdn/launcher.apk`}));
r.get('/hash.json', (req, res) => res.json([]));

// Дополнительные эндпоинты с данными
r.get('/fractionMenuDocuments.json', (req, res) => res.json({"documents": [{"id": 1, "name": "Паспорт", "price": 500}]}));
r.get('/fractionTask.json', (req, res) => res.json({"tasks": [{"id": 1, "name": "Патруль", "reward": 1000}]}));
r.get('/fractionMenuStore.json', (req, res) => res.json({"items": [{"id": 1, "name": "Снаряжение", "price": 2000}]}));
r.get('/awards.json', (req, res) => res.json({"awards": [{"id": 1, "name": "Деньги", "type": "money"}]}));
r.get('/buttons-config.json', (req, res) => res.json({"buttons": [{"id": "inv", "visible": true}]}));
r.get('/calendar.json', (req, res) => res.json({"properties": {"seasonColor": "#0000FF"}, "rewards": []}));
r.get('/car-colors.json', (req, res) => res.json([{"id": 1, "hex": "#FFFFFF"}]));
r.get('/cases.json', (req, res) => res.json({"cases": [{"id": 1, "name": "Кейс новичка"}]}));
r.get('/cinematic.json', (req, res) => res.json({"url": "https://example.com/video.mp4"}));
r.get('/craft.json', (req, res) => res.json({"items": []}));
r.get('/inventory.json', (req, res) => res.json({"items": []}));
r.get('/skins.json', (req, res) => res.json([{"id": 1, "modelId": 1, "name": "Skin"}]));
r.get('/tune-items.json', (req, res) => res.json({"items": []}));

// Все остальные эндпоинты из Api.java (наполняем данными)
const others = [
    'craft-item-categories.json', 'craft-filter-categories.json', 'family_system.json', 'event.json',
    'market-vip-limits.json', 'market-delivery-filter.json', 'market-filter-categories.json',
    'smi_editor_body.json', 'cars-and-accessories.json', 'social-interaction.json', 'tanpin.json',
    'tune-screens.json', 'tune-vinyls.json', 'newyear-gifts.json', 'newyear-awards.json'
];
others.forEach(endpoint => {
    r.get(`/${endpoint}`, (req, res) => {
        // Отдаем не пустой объект, а структуру, которую ждет Retrofit
        res.json({ "status": "ok", "data": [], "items": [], "array": [] });
    });
});

r.get('/listOfYoutubers.json', (req, res) => res.json([{"name": "Admin", "channel": "https://youtube.com"}]));

app.use('/client', r);
app.get('/', (req, res) => res.send('Black Russia Backend Active'));

app.listen(port, () => console.log(`Server started on port ${port}`));
