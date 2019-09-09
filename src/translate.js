(function(root, factory) {

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.translate = factory();
    }

}(this, function() {

    function each(storage, callback) {
        for (var key in storage) {
            storage.hasOwnProperty(key) && callback(key, storage[key]);
        }
    }

    function createRegistry() {

        var registry = {};
        var currentLocale = 'en';
        var interpolateRE = /{{\s*(\w+)\s*}}/g;
        var pluralizationRules = {
            en: {
                pluralizeTo: 'count',
                getVariationIndex: function(count) {
                    return (1 === count) ? 0 : 1;
                }
            }
        };

        function translate(key, templateData, options) {

            options = options || {};

            var locale = options.locale || currentLocale;
            var store = options.registry || registry;
            var translation = store[locale] && store[locale][key];

            if (typeof translation === 'undefined') {
                return translate.whenUndefined(key, locale);
            } else if (Array.isArray(translation)) {
                return translatePlural(
                    key, translation, templateData, locale, options.pluralizeTo
                );
            } else {
                return interpolate(translation, templateData);
            }

        }

        function translatePlural(key, variations, data, locale, pluralizeTo) {

            var rule = pluralizationRules[locale];
            var dataKeys = Object.keys(data);
            var pluralizeKey = dataKeys.length === 1
                ? dataKeys[0]
                : (pluralizeTo || rule.pluralizeTo)
            ;
            var count = parseFloat(data[pluralizeKey]);

            if (isNaN(count)) {
                throw new Error('Tranlation pluralization missing parameters on key "' + key + '"');
            } else {
                return interpolate(variations[rule.getVariationIndex(count)], data);
            }

        }

        function interpolate(translationString, data) {

            return data ? translationString.replace(interpolateRE, function(match, param) {
                return data.hasOwnProperty(param) ? data[param] : match;
            }) : translationString;

        }

        translate.add = function(items, locale, prefix) {

            locale = locale || currentLocale;
            registry[locale] = registry[locale] || {};

            each(items, function(key, value) {

                var registryKey = prefix ? prefix + '.' + key : key;
                var valueType = typeof value;

                if (Array.isArray(value) || valueType === 'string' || valueType === 'number') {
                    registry[locale][registryKey] = value;
                } else {
                    translate.add(value, locale, registryKey);
                }

            });

            return this;

        };

        translate.setLocale = function(locale) {

            currentLocale = locale;
            return this;

        };

        translate.getLocale = function() {

            return currentLocale;

        };

        translate.interpolateWith = function(userRE) {

            interpolateRE = userRE;
            return this;

        };

        translate.setPluralizationRule = function(locale, rule, options) {

            pluralizationRules[locale] = {
                pluralizeTo: options && options.pluralizeTo || 'count',
                getVariationIndex: rule
            };
            return this;

        };

        translate.whenUndefined = function(key, locale) {

            return key;

        };

        translate.clear = function() {

            registry = {};
            return this;

        };

        translate.createRegistry = function() {

            return createRegistry();

        };

        return translate;

    }

    return createRegistry();

}));
