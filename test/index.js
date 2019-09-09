var assert = require('chai').assert;
var translateLib = require('../');
var translate;

beforeEach(function() {
    translate = translateLib.createRegistry();
});

describe('translate', function() {

    it('has english set as default locale', function() {

        assert.equal(translate.getLocale(), 'en');

    });

    it('sets locale to user value', function() {

        translate.setLocale('hr');
        assert.equal(translate.getLocale(), 'hr');

    });

    it('can correctly add and access items', function() {

        translate.add({
            title: 'Project title',
            'title.long': 'Long project title',
            counter: 234,
            button: {
                text: 'Click me',
                caption: 'Please click this button'
            },
            deep: {
                nested: {
                    label: 'Deep nested label'
                }
            }
        }).add({numberInput: 'Value is not a number'}, 'en', 'errors');

        translate.add({numberInput: 'Vrijednost nije broj'}, 'hr', 'errors');

        assert.equal(translate('title'), 'Project title');
        assert.equal(translate('title.long'), 'Long project title');
        assert.equal(translate('counter'), 234);
        assert.equal(translate('button.text'), 'Click me');
        assert.equal(translate('button.caption'), 'Please click this button');
        assert.equal(translate('deep.nested.label'), 'Deep nested label');
        assert.equal(translate('errors.numberInput'), 'Value is not a number');
        assert.equal(translate('errors.numberInput', null, {locale: 'hr'}), 'Vrijednost nije broj');

    });

    it('will translate from custom registry and locale', function() {

        assert.equal(translate('foo', null, {
            locale: 'en',
            registry: {en: {foo: 'bar'}}
        }), 'bar');

    });

    it('will empty registry when clear is called', function() {

        translate.add({title: 'Test title'});
        translate.clear();
        assert.equal(translate('title'), 'title');

    });

    it('will return key by default if requested item is not in registry', function() {

        assert.equal(translate('title'), 'title');

    });

    it('will run user whenUndefined callback if item is not in registry', function() {

        translate.whenUndefined = function(key) {
            return key + ':undefined';
        };

        assert.equal(translate('title'), 'title:undefined');

    });

    it('will parse template with user data', function() {

        translate.add({
            welcomeMessage: 'Hello {{ userName }}',
            taskCounterMessage: '{{taskCounter}} tasks left {{userName }}'
        });

        assert.equal(translate('welcomeMessage', {userName: 'George'}), 'Hello George');
        assert.equal(translate('welcomeMessage', {}), 'Hello {{ userName }}');
        assert.equal(translate('taskCounterMessage', {taskCounter: 4, userName: 'George'}), '4 tasks left George');
        assert.equal(translate('taskCounterMessage', {taskCounter: 0, userName: 'George'}), '0 tasks left George');

    });

    it('will pluralize english translations', function() {

        translate.add({
            items: [
                '{{ itemCount }} item',
                '{{ itemCount }} items'
            ],
            basketItems: [
                '{{ count }} item in {{ size }} basket',
                '{{ count }} items in {{ size }} basket'
            ],
            accountCoins: [
                '{{ coinCount }} coin in {{ account }} account',
                '{{ coinCount }} coins in {{ account }} account'
            ]
        });

        assert.equal(translate('items', {itemCount: 1}), '1 item');
        assert.equal(translate('items', {itemCount: 2}), '2 items');
        assert.equal(translate('items', {itemCount: '1'}), '1 item');
        assert.equal(translate('items', {itemCount: '2'}), '2 items');
        assert.equal(translate('items', {itemCount: '15.5'}), '15.5 items');

        assert.equal(translate('basketItems', {count: 1, size: 'big'}), '1 item in big basket');
        assert.equal(translate('basketItems', {count: 2, size: 'small'}), '2 items in small basket');

        assert.equal(
            translate('accountCoins', {coinCount: 1, account: 'domestic'}, {pluralizeTo: 'coinCount'}),
             '1 coin in domestic account'
        );
        assert.equal(
            translate('accountCoins', {coinCount: 2, account: 'foreign'}, {pluralizeTo: 'coinCount'}),
            '2 coins in foreign account'
        );

        assert.throws(() => translate('accountCoins', {coinCount: 2, account: 'foreign'}));
        assert.throws(() => translate('items'));
        assert.throws(() => translate('basketItems'));

    });

    it('allows extending pluralization rules', function() {

        translate.setPluralizationRule('hr', $number => {
            // https://github.com/symfony/translation/blob/master/PluralizationRules.php#L156
            return ((1 == $number % 10) && (11 != $number % 100)) ? 0 : ((($number % 10 >= 2) && ($number % 10 <= 4) && (($number % 100 < 10) || ($number % 100 >= 20))) ? 1 : 2);
        }, {pluralizeTo: 'count'});

        translate.setLocale('hr').add({
            balls: [
                '{{ count }} lopta',
                '{{ count }} lopte',
                '{{ count }} lopti'
            ],
            minutes: [
                '{{ count }} minuta',
                '{{ count }} minute',
                '{{ count }} minuta'
            ]
        });

        assert.equal(translate('balls', {count: 1}), '1 lopta');
        assert.equal(translate('balls', {count: 2}), '2 lopte');
        assert.equal(translate('balls', {count: 5}), '5 lopti');

        assert.equal(translate('minutes', {count: 1}), '1 minuta');
        assert.equal(translate('minutes', {count: 2}), '2 minute');
        assert.equal(translate('minutes', {count: 5}), '5 minuta');
        assert.equal(translate('minutes', {count: 6}), '6 minuta');
        assert.equal(translate('minutes', {count: 12}), '12 minuta');
        assert.equal(translate('minutes', {count: 18}), '18 minuta');
        assert.equal(translate('minutes', {count: 22}), '22 minute');
        assert.equal(translate('minutes', {count: 28}), '28 minuta');
        assert.equal(translate('minutes', {count: 1328}), '1328 minuta');

    });

    it('will parse template with custom user interpolate RE', function() {

        translate.add({welcomeMessage: 'Hello $userName'});
        translate.interpolateWith(/\$(\w+)/g);

        assert.equal(translate('welcomeMessage', {userName: 'George'}), 'Hello George');

    });

});
