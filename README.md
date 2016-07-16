#Translate JS
[![Build Status](https://travis-ci.org/dbrekalo/translate-js.svg?branch=master)](https://travis-ci.org/dbrekalo/translate-js)
[![Coverage Status](https://coveralls.io/repos/github/dbrekalo/translate-js/badge.svg?branch=master)](https://coveralls.io/github/dbrekalo/translate-js?branch=master)
[![NPM Status](https://img.shields.io/npm/v/translate-js.svg?style=flat)](https://www.npmjs.com/package/translate-js)

Small library for managing translations and localization with simple api. Works client and server side. Less then 1KB.

##Installation
```sh
npm install translate-js --save
bower install translate-js --save
```

##Basic usage
```javascript
// add items to translate registry
translate.add({
    projectTitle: 'Project title',
    button: {
        text: 'Click me {{userName}}!',
        caption: 'Please click me!'
    },
    deep: {
        nested: {
            label: 'Deep nested label'
        }
    }
});

// get translations
translate('projectTitle'); // outputs  "Project title"
translate('button.text', {userName: 'George'}); // outputs  "Click me George!"
translate('button.caption'); // outputs  "Please click me!"
translate('deep.nested.label'); // outputs  "Deep nested label"
```

##Advanced usage
```javascript
// add items to specific locale
translate.add({projectTitle: 'Project title'}, 'en');
translate.add({projectTitle: 'Título del Proyecto'}, 'es');

// add items to specific locale and prefix keys with custom namespace
translate.add({numberInput: 'Value is not a number'}, 'en', 'errors');
translate.add({numberInput: 'El valor no es un número'}, 'es', 'errors');

// get translations
translate('projectTitle'); // outputs  "Project title"
translate('projectTitle', null, {locale: 'es'}); // outputs  "Título del Proyecto!"
translate('errors.numberInput'); // outputs  "Value is not a number"

// set locale for future translate calls
translate.setLocale('es');
translate.getLocale(); // outputs "es"
translate('errors.numberInput'); // outputs  "El valor no es un número"

// change what happens when item is not in registry
translate.whenUndefined = function(key, locale) {
    return key + ':undefined:' + locale
};
translate('errors.dateInput'); // outputs  "errors.dateInput:undefined:es"

// change how translate interpolates template strings
translate.add({welcomeMessage: 'Hello $userName'});
translate.interpolateWith(/\$(\w+)/g);
translate('welcomeMessage', {userName: 'George'}); // outputs "Hello George"

// clear / empty translate registry
translate.clear();
```
##API

##translate
```javascript
translate(key, templateData, options);
```
Translates string stored under specified key to current locale.
Interpolates template string if templateData is given.
Specific locale translation can be specified via options.locale.

##translate.add
```javascript
translate.add(items, locale, keyPrefix);
```
Imports items (plain or nested object) to translate registry under specific locale (defaults to "en").
Prefix on item keys can optionally be added as keyPrefix parameter;

##translate.setLocale
```javascript
translate.setLocale(locale);
```
Sets current locale for future translate calls.

##translate.getLocale
```javascript
translate.getLocale();
```
Gets current locale

##translate.interpolateWith
```javascript
translate.interpolateWith(interpolateRE);
```
Sets regular expression for template strings interpolation.

##translate.whenUndefined
```javascript
translate.whenUndefined = function(key, locale) {};
```
Define custom handler for use case when requested item is not in registry.

##translate.clear
```javascript
translate.clear();
```
clear / empty all items in translate registry
