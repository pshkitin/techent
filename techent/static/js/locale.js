globalCalendar.locale = {};

globalCalendar.locale = {
    translations: {},
    plurals: {},
    pluralForms: 2,
    weekStartsFromMonday: false,

    /**
     * Detarmine plural case by a number. Should be overridden in concrete locale.
     *
     * @param n number
     */
    getPluralCase: function (n) {
        if (n == 1) {
            return 0;
        }
        return 1;
    },

    getTranslation: function (str) {
        var localStr = globalCalendar.locale.translations[str];
        if (localStr == undefined) {
            return str;
        }
        return localStr;
    },

    addTranslation: function (str, localStr) {
        globalCalendar.locale.translations[str] = localStr;
    },

    getPlural: function (n, str, plural) {
        var plVariants = globalCalendar.locale.plurals[str];
        if (plVariants == undefined) {
            return n == 1 ? str : plural;
        }
        var pluralCase = globalCalendar.locale.getPluralCase(n);
        return plVariants[pluralCase];
    },

    addPlural: function () {
        var key = arguments[0];
        var pluralVariants = [];
        for (var i = 1; i <= globalCalendar.locale.pluralForms; ++i) {
            pluralVariants.push(arguments[i]);
        }
        globalCalendar.locale.plurals[key] = pluralVariants;
    }
};
