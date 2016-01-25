import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import PageObject from '../../page-object';

const {
  selectable,
  text,
  collection,
  isVisible
} = PageObject;

moduleForComponent('user-list', 'Integration | component integration test support/user list', {
  integration: true
});

// FIXME: Can't use the global `$` here for integration tests
function isDisabled(selector) {
  return $(selector).prop('disabled');
}

// FIXME: This used to be a `customHelper`. Make sure this still
// works and is bound to the single item in which it is called.
function selectBox(selector) {
  return {
    select: selectable(selector),
    selected: text(`option:selected`),
    isDisabled: isDisabled(selector)
  };
}

// FIXME: This used to be a `customHelper`. Make sure this still
// works and is bound to the single item in which it is called.
function isAdmin(selector) {
  return function() {
    return $(selector).hasClass('admin');
  };
}

test('Component contents', function(assert) {
  assert.expect(8);

  const page = PageObject.create({
    context: this,

    title: text('h1'),

    users: collection({
      itemScope: 'tbody tr',

      item: {
        userName: text('td', { at: 0 }),
        role: text('td', { at: 1 }),
        animalPreference: selectBox('select'),
        isAdmin: isAdmin(),
        isVisible: isVisible()
      }
    })
  });

  this.set('users', [
    { userName: 'jane', role: 'admin', disabledAnimalPreference: false, admin: true },
    { userName: 'john', role: 'guest', disabledAnimalPreference: true, admin: false }
  ]);

  this.render(hbs`{{user-list users=users}}`);

  page.users(0).animalPreference.select('Tomsters');

  assert.equal(page.title, 'Users');
  assert.equal(page.users().count, 2);
  assert.ok(page.users(0).isVisible);
  assert.equal(page.users(0).userName, 'jane');
  assert.equal(page.users(0).role, 'admin');
  assert.equal(page.users(0).animalPreference.selected, 'Tomsters');
  assert.ok(page.users(0).isAdmin, 'is not admin');
  assert.equal(page.users(1).animalPreference.isDisabled, true);
});
