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

    it('will parse template with custom user interpolate RE', function() {

        translate.add({welcomeMessage: 'Hello $userName'});
        translate.interpolateWith(/\$(\w+)/g);

        assert.equal(translate('welcomeMessage', {userName: 'George'}), 'Hello George');

    });

});
