CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    alias VARCHAR(100) NOT NULL,
    is_special BOOLEAN NOT NULL DEFAULT FALSE,
    passcode TEXT NOT NULL,
    session_token TEXT,
    session_expires_at TIMESTAMP
);

CREATE TABLE clothes (
    id SERIAL PRIMARY KEY,
    image_id VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    artikul VARCHAR(100),
    store_name VARCHAR(100),
    store_url TEXT
);

CREATE TABLE outfits (
    id SERIAL PRIMARY KEY,
    image_id VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    season VARCHAR(50),
    label VARCHAR(50)
);

CREATE TABLE capsulas (
    id SERIAL PRIMARY KEY,
    image_id VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    season_1 VARCHAR(25) NOT NULL,
    season_2 VARCHAR(25) DEFAULT NULL
);

CREATE TABLE outfits_superset (
    outfit_id INTEGER REFERENCES outfits(id) ON DELETE CASCADE,
    clothes_id INTEGER REFERENCES clothes(id) ON DELETE CASCADE,
    PRIMARY KEY (outfit_id, clothes_id)
);

CREATE TABLE capsulas_superset (
    capsulas_id INTEGER REFERENCES capsulas(id) ON DELETE CASCADE,
    outfit_id INTEGER REFERENCES outfits(id) ON DELETE CASCADE,
    PRIMARY KEY (capsulas_id, outfit_id)
);

CREATE TABLE users_liked (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    liked_type VARCHAR(20) NOT NULL CHECK (liked_type IN ('clothes', 'outfits', 'capsulas')),
    liked_id INTEGER NOT NULL
);

-- INSERTION QUERIES --
INSERT INTO clothes (id, image_id, title, description, category, artikul, store_name, store_url) VALUES
(1, '1', 'Футболка', 'Укороченная женская футболка свободного кроя из легкой и дышащей 100% хлопковой ткани высокой плотности', 'Верх', 'BF2521120042', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2521120042/97?utm_source=Befree_share&utm_medium=web'),
(2, '2', 'Лонгслив', 'Однотонный джемпер с открытыми плечами приталенного кроя из мягкой, дышащей и очень приятной к телу ткани с добавлением лиоцелла', 'Верх', '2421122019', 'Befree', 'https://Befree.ru/zhenskaya/product/2421122019/1?utm_source=Befree_share&utm_medium=web'),
(3, '3', 'Топ-майка', 'Топ приталенного кроя из эластичного джерси на основе хлопка, тонкие регулируемые бретели.', 'Верх', '3402-134', 'Lime', 'https://Lime-shop.com/ru_ru/product/24329_3402_134-belyi?utm_source=web_sharing'),
(4, '4', 'Топ-майка', 'Топ приталенного кроя из эластичного джерси на основе хлопка, тонкие регулируемые бретели.', 'Верх', '3402-134', 'Lime', 'https://Lime-shop.com/ru_ru/product/24329_3402_134-cernyi?utm_source=web_sharing'),
(5, '5', 'Лонгслив', 'Короткая женская блузка облегающего кроя из легкого кружева и дышащей хлопковой ткани в рубчик', 'Верх', 'BF2522418005', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2522418005/97'),
(6, '6', 'Футболка', 'Укороченная женская футболка-топ облегающего кроя из дышащей, плотной, приятной к телу ткани на основе хлопка с гладкой трикотажной фактурой', 'Верх', 'TCROP4COL', 'Befree', 'https://Befree.ru/zhenskaya/product/TCROP4COL/71?utm_source=Befree_share&utm_medium=web'),
(7, '7', 'Лонгслив', 'Лонгслив приталенного кроя из мягкого и легкого трикотажа с добавлением вискозы', 'Верх', 'BF2531122027', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2531122027/50?utm_source=Befree_share&utm_medium=web'),
(8, '8', 'Свитшот', 'Свитшот half zip из футера с принтом', 'Верх', 'BF2531123001', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2531123001/26'),
(9, '9', 'Свитер', 'Джемпер вязаный с узором-косичкой', 'Верх', 'BF2441526025', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2441526025/60'),
(10, '10', 'Лонгслив', 'Лонгслив облегающего кроя из эластичного хлопкового джерси в рубчик', 'Верх', '8204-688', 'Lime', 'https://Lime-shop.com/ru_ru/product/23848_8204_688-cernyi'),
(11, '11', 'Джинсы', 'Джинсы современной модели с отворотами', 'Низ', '5357402708', 'Loverepublic', 'https://Loverepublic.ru/catalog/odezhda/dzhinsy/285472/'),
(12, '12', 'Джинсы', 'Джинсы flare с высокой посадкой', 'Низ', '5153410713', 'Loverepublic', 'https://Loverepublic.ru/catalog/odezhda/dzhinsy/275862/'),
(13, '13', 'Брюки', 'Классические брюки с защипами', 'Низ', '5151208719', 'Loverepublic', 'https://Loverepublic.ru/catalog/odezhda/bryuki/272928/'),
(14, '14', 'Джоггеры', 'Брюки-джоггеры базовые трикотажные из футера', 'Низ', 'BF2511108003MEL', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2511108003MEL/38?utm_source=Befree_share&utm_medium=web'),
(15, '15', 'Юбка', 'Джинсовая мини юбка', 'Низ', '5254429207', 'Loverepublic', 'https://Loverepublic.ru/catalog/odezhda/yubki/282896/'),
(16, '16', 'Шорты', 'Джинсовые мини шорты', 'Низ', '5255432711', 'Loverepublic', 'https://Loverepublic.ru/catalog/odezhda/shorty/283003/'),
(17, '17', 'Брюки', 'Однотонные повседневные брюки из трикотажа', 'Низ', 'MP002XW19YE5', 'Lamoda', 'https://www.lamoda.ru/p/mp002xw19ye5/clothes-Calzedonia-bryuki/?utm_referrer=https%3A%2F%2Fweb.telegram.org%2F'),
(18, '18', 'Брюки', 'Брюки прямого кроя из экокожи', 'Низ', '4451206732', 'Loverepublic', 'https://Loverepublic.ru/catalog/odezhda/bryuki/268598/'),
(19, '19', 'Джоггеры', 'Джоггеры из хлопкового футера с мягкой изнанкой', 'Низ', '1305-401', 'Lime', 'https://Lime-shop.com/ru_ru/product/21410_1305_401-seryi'),
(20, '20', 'Толстовка', 'Толстовка с объемными рукавами, плотный трикотаж с вискозой', 'Верхняя одежда', '5152108311', 'Loverepublic', 'https://Loverepublic.ru/catalog/odezhda/bruchniy_kostum/274285/'),
(21, '21', 'Кожанка', 'Куртка-косуха приталенного кроя из гладкой, мягкой и очень приятной на ощупь искусственной кожи с подкладкой', 'Верхняя одежда', 'BF2521601002', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2521601002/50?utm_source=Befree_share&utm_medium=web'),
(22, '22', 'Рубашка', 'Укороченная рубашка прямого кроя изо льна и вискозы', 'Верхняя одежда', '7430-486', 'Lime', 'https://Lime-shop.com/ru_ru/product/24945_7430_486-belyi?utm_source=web_sharing'),
(23, '23', 'Кардиган', 'Кардиган из мохера и шерсти', 'Верхняя одежда', '5153327617', 'Loverepublic', 'https://Loverepublic.ru/catalog/odezhda/trikotazh/dzhempery/281172/'),
(24, '24', 'Пальто', 'Двубортное oversize пальто из смесовой шерсти', 'Верхняя одежда', '6510-995', 'Lime', 'https://Lime-shop.com/ru_ru/product/9750_6510_995-sero_bezevyi_melanz'),
(25, '25', 'Худи', 'Худи-зипка из футера с вареным эффектом', 'Верхняя одежда', 'BF2521123003', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2521123003/32'),
(26, '26', 'Куртка', 'Куртка короткая стеганая с капюшоном', 'Верхняя одежда', 'BF2441601023', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2441601023/40'),
(27, '27', 'Пуховик', 'Пуховик выполнен из стеганого текстиля. Модель объемного кроя', 'Верхняя одежда', 'MP002XW12NB4', 'Lamoda', 'https://www.lamoda.ru/p/mp002xw12nb4/clothes-fligel-pukhovik/'),
(28, '28', 'Кроссовки', 'Кроссовки из текстиля и термополиуретана', 'Обувь', 'MP002XW00V2R', 'Lamoda', 'https://www.lamoda.ru/p/mp002xw00v2r/shoes-o2live-krossovki/?utm_referrer=https%3A%2F%2Fweb.telegram.org%2F'),
(29, '29', 'Сандалии', 'Сандалии из искусственной кожи', 'Обувь', 'MP002XW0OKFL', 'Patrol', 'https://www.lamoda.ru/p/mp002xw0okfl/shoes-patrol-sandalii/'),
(30, '30', 'Ботинки', 'Ботинки со шнурками на массивной платформе', 'Обувь', 'BF2446687002', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2446687002/50?utm_source=Befree_share&utm_medium=web'),
(31, '31', 'Угги', 'Угги из натуральной замши с шерстью внутри', 'Обувь', 'MP002XW1CN95', 'Lamoda', 'https://www.lamoda.ru/p/mp002xw1cn95/shoes-dinoricci-polusapogi/'),
(32, '32', 'Ботинки', 'Ботинки из натуральной кожи', 'Обувь', 'MP002XW12WQG', 'Lamoda', 'https://www.lamoda.ru/p/mp002xw12wqg/shoes-mofberg-botinki/?promotion_provider_id=6cdb4c57-a6e4-466e-9957-65d566034f03'),
(33, '33', 'Ботинки', 'Зимние ботинки из текстиля с шерстью внутри', 'Обувь', 'MP002XW123DK', 'Lamoda', 'https://www.lamoda.ru/p/mp002xw123dk/shoes-o2live-botinki/'),
(34, '34', 'Ботинки', 'Сапоги из полиэстера с искусственным мехом внутри', 'Обувь', 'MP002XW0IBUY', 'Lamoda', 'https://www.lamoda.ru/p/mp002xw0ibuy/shoes-nordman-sapogi/'),
(35, '35', 'Серьги', 'Серьги-бантики из бижутерного сплава 100%', 'Аксессуар', 'MP002XW1BAUS', 'Lamoda', 'https://www.lamoda.ru/p/mp002xw1baus/accs-hotei-sergi/'),
(36, '36', 'Ремень', 'Узкий женский брючный ремень из лакированной искусственной кожи', 'Аксессуар', 'BF2525346011', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2525346011/50?utm_source=Befree_share&utm_medium=web'),
(37, '37', 'Сумка', 'Маленькая женская сумка-багет из искусственной кожи в однотонном варианте, с вареным эффектом и в лакированном варианте', 'Аксессуар', 'BF2525457025', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2525457025/27?utm_source=Befree_share&utm_medium=web'),
(38, '38', 'Сумка', 'Женская прямоугольная сумка-шопер из плотной ткани с хлопком', 'Аксессуар', 'BF2525457011', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2525457011/99'),
(39, '39', 'Заколка', 'Краб из ацетата имеет гладкую поверхность и скругленные края, не травмируют волосы и кожу головы', 'Аксессуар', 'MP002XW1BYZ7', 'Lamoda', 'https://www.lamoda.ru/p/mp002xw1byz7/accs-assoro-zakolkakrab/'),
(40, '40', 'Очки', 'Солнцезащитные очки в прямоугольной пластиковой оправе', 'Аксессуар', 'BF2525360036', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2525360036/1?utm_source=Befree_share&utm_medium=web'),
(41, '41', 'Кепка', 'Однотонная бейсболка из хлопка', 'Аксессуар', 'MP002XU0901J', 'Lamoda', 'https://www.lamoda.ru/p/mp002xu0901j/accs-matrixsport-beysbolka/'),
(42, '42', 'Зонтик', 'Однотонный зонт-автомат', 'Аксессуар', 'MP002XU092PT', 'Lamoda', 'https://www.lamoda.ru/p/mp002xu092pt/accs-faustini-zont-skladnoy/'),
(43, '43', 'Сумка', 'Бордовая сумка из изкусственной кожи', 'Аксессуар', 'MP002XW1FF7L', 'Lamoda', 'https://www.lamoda.ru/p/mp002xw1ff7l/bags-marmalato-sumka/'),
(44, '44', 'Шапка', 'Шапка-бини вязаная в рубчик с широким отворотом', 'Аксессуар', 'ScandicRibHat', 'Befree', 'https://Befree.ru/zhenskaya/product/ScandicRibHat/50?utm_source=Befree_share&utm_medium=web'),
(45, '45', 'Сумка', 'Сумка на плечо стеганая с бантами', 'Аксессуар', 'BF2445457005', 'Befree', 'https://Befree.ru/zhenskaya/product/BF2445457005/50?utm_source=Befree_share&utm_medium=web');

INSERT INTO outfits (id, image_id, title, description, season, label) VALUES
(1, '46', 'Образ №1', NULL, 'Весна', 'Романтический'),
(2, '47', 'Образ №2', NULL, 'Весна', 'Повседневный'),
(3, '48', 'Образ №3', NULL, 'Весна', 'Кэжуал'),
(4, '49', 'Образ №4', NULL, 'Весна', 'Спортивный'),
(5, '50', 'Образ №5', NULL, 'Весна', 'Элегантный'),
(6, '52', 'Образ №1', NULL, 'Лето', 'Романтический'),
(7, '53', 'Образ №2', NULL, 'Лето', 'Пляж'),
(8, '54', 'Образ №3', NULL, 'Лето', 'Повседневный'),
(9, '55', 'Образ №4', NULL, 'Лето', 'Повседневный'),
(10, '56', 'Образ №5', NULL, 'Лето', 'Кэжуал'),
(11, '58', 'Образ №1', NULL, 'Осень', 'Элегантный'),
(12, '59', 'Образ №2', NULL, 'Осень', 'Кэжуал'),
(13, '60', 'Образ №3', NULL, 'Осень', 'Коктейльный'),
(14, '61', 'Образ №4', NULL, 'Осень', 'Повседневный'),
(15, '62', 'Образ №5', NULL, 'Осень', 'Романтический'),
(16, '64', 'Образ №1', NULL, 'Зима', 'Повседневный'),
(17, '65', 'Образ №2', NULL, 'Зима', 'Спортивный'),
(18, '66', 'Образ №3', NULL, 'Зима', 'Минималистичный'),
(19, '67', 'Образ №4', NULL, 'Зима', 'Кэжуал'),
(20, '68', 'Образ №5', NULL, 'Зима', 'Повседневный');

INSERT INTO capsulas (id, image_id, title, description, season_1, season_2) VALUES
(1, '51', 'Весна', 'Капсула отражает пробуждение природы. здесь есть всё, чтобы оставаться стильным в переменчивую весеннюю погоду – от демисезонных коажнок до лёгких топов, которые легко комбинируются между собой.', 'Весна', 'Лето'),
(2, '57', 'Лето', 'Лёгкие, дышащие ткани и приятные цвета – эта капсула создана для жарких дней. В ней продумана каждая деталь, чтобы выглядеть свежо даже в самый зной, будь то прогулка по городу или отдых на море.', 'Лето', NULL),
(3, '63', 'Осень', 'Тёплая, но не громоздкая, эта капсула идеальна для прохладной осени. в ней сочетаются уютные вещи, стильные теплые элементы и удобная обувь на любой случай – от дождливых будней до вечерних встреч.', 'Осень', NULL),
(4, '69', 'Зима', 'Эта капсула сочетает в себе все необходимое для суровых зимних дней – от уютных объемных свитеров до практичных пуховиков. баланс между функциональностью и современностью делает ее идеальной для повседневной носки, работы и выходов в свет', 'Зима', NULL);

INSERT INTO outfits_superset (outfit_id, clothes_id) VALUES
(1, 1), (1, 12), (1, 28), (1, 35), (1, 36),
(2, 4), (2, 12), (2, 21), (2, 30), (2, 36), (2, 37),
(3, 14), (3, 20), (3, 21), (3, 30),
(4, 3), (4, 14), (4, 20), (4, 28),
(5, 2), (5, 13), (5, 21), (5, 28), (5, 35), (5, 37),
(6, 5), (6, 15), (6, 28), (6, 39), (6, 40),
(7, 4), (7, 16), (7, 22), (7, 29), (7, 40), (7, 41),
(8, 3), (8, 15), (8, 28), (8, 38), (8, 41),
(9, 3), (9, 16), (9, 29), (9, 38), (9, 39), (9, 40),
(10, 3), (10, 16), (10, 22), (10, 28), (10, 40), (10, 41),
(11, 6), (11, 17), (11, 24), (11, 32), (11, 43),
(12, 17), (12, 23), (12, 32), (12, 42),
(13, 8), (13, 18), (13, 24), (13, 31), (13, 43),
(14, 7), (14, 17), (14, 24), (14, 32), (14, 42),
(15, 6), (15, 18), (15, 23), (15, 31), (15, 43),
(16, 11), (16, 27), (16, 33), (16, 44), (16, 45),
(17, 19), (17, 25), (17, 26), (17, 34),
(18, 9), (18, 11), (18, 26), (18, 34),
(19, 10), (19, 11), (19, 26), (19, 33), (19, 44), (19, 45),
(20, 9), (20, 19), (20, 27), (20, 34), (20, 44), (20, 45);

INSERT INTO capsulas_superset (capsulas_id, outfit_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
(3, 11), (3, 12), (3, 13), (3, 14), (3, 15),
(4, 16), (4, 17), (4, 18), (4, 19), (4, 20);