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

    var registry = {};
    var currentLocale = 'en';
    var interpolateRE = /{{(\w+)}}/g;

    function each(storage, callback) {

        for (var key in storage) {
            storage.hasOwnProperty(key) && callback(key, storage[key]);
        }

    }

    function translate(key, templateData, options) {

        options = options || {};
        var locale = options.locale || currentLocale;
        var translation =  registry[locale] && registry[locale][key];

        if (typeof translation === 'undefined') {
            return translate.whenUndefined(key, locale);
        } else {
            return templateData ? translation.replace(interpolateRE, function(match, param) {
                return templateData[param] || match;
            }) : translation;
        }

    }

    translate.add = function(items, locale, prefix) {

        locale = locale || currentLocale;
        registry[locale] = registry[locale] || {};

        each(items, function(key, value) {

            var registryKey = prefix ? prefix + '.' + key : key;
            var valueType = typeof value;

            if (valueType === 'string' || valueType === 'number') {
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

    translate.whenUndefined = function(key, locale) {

        return key;

    };

    translate.clear = function() {

        registry = {};
        return this;

    };

    return translate;

}));
