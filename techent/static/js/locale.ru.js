globalCalendar.locale.pluralForms = 3;
globalCalendar.locale.weekStartsFromMonday = true;

globalCalendar.locale.getPluralCase = function (n) {
    if (n % 10 == 1 && n % 100 != 11) {
        return 0;
    }
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
        return 1;
    }
    return 2;
};

var addT = globalCalendar.locale.addTranslation;
var addP = globalCalendar.locale.addPlural;

addT('Global Calendar', 'Мировой календарь');
addT('Starts:', 'Начинается:');
addT('Ends:', 'Заканчивается:');
addT('Duration:', 'Длительность:');
addT('(next&nbsp;day)', '(следующего&nbsp;дня)');
addT('Event Details', 'Описание события');
addT('Monday', 'Понедельник');
addT('Tuesday', 'Вторник');
addT('Wednesday', 'Среда');
addT('Thursday', 'Четверг');
addT('Friday', 'Пятница');
addT('Saturday', 'Суббота');
addT('Sunday', 'Воскресенье');
addT('Address:', 'Адрес:');
addT('How to find:', 'Как найти:');

addT('Start datetime:', 'Дата и время начала:');
addT('Duration:', 'Продолжительность:')


addP('hour', 'час', 'часа', 'часов');
addP('minute', 'минута', 'минуты', 'минут');
