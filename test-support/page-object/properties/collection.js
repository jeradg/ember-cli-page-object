import Ember from 'ember';
import { buildSelector } from '../helpers';
import { create } from '../create';
import { count } from './count';

function merge(target, ...objects) {
  objects.forEach(o => Ember.merge(target, o));

  return target;
}

function select(target, ...keys) {
  var object = {};

  keys.forEach(key => object[key] = target[key]);

  return object;
}

function generateEnumerable(definition) {
  var enumerable = merge({}, definition);

  delete enumerable.itemScope;

  if (typeof enumerable.count === 'undefined') {
    enumerable.count = count(definition.itemScope)
  }

  return create(enumerable);
}

function generateItem(index, definition) {
  var filters = merge({}, { scope: definition.scope, at: index });
  var scope = buildSelector({}, definition.itemScope, filters);

  return create(merge({}, definition.item, { scope, resetScope: definition.resetScope }), { parent: this });
}

/**
 * Creates a component that represents a collection of items
 *
 * @example
 *
 *   var page = PageObject.create({
 *     users: collection({
 *       itemScope: 'table tr',
 *
 *       item: {
 *         firstName: text('td', { at: 0 })
 *         lastName: text('td', { at: 1 })
 *       }
 *   });
 *
 *   assert.equal(page.users().count(), 2);
 *   assert.equal(page.users(1).firstName, 'John');
 *   assert.equal(page.users(1).lastName, 'Doe');
 *
 * @param {Object} definition - Collection definition
 * @param {String} definition.itemScope - CSS selector
 * @param {Object} definition.item - Item definition
 * @return {Descriptor}
 */
export function collection(definition) {
  return {
    isDescriptor: true,

    value(index) {
      if (typeof index === 'number') {
        return generateItem.call(this, index, definition);
      } else {
        return generateEnumerable.call(this, definition);
      }
    }
  };
}

// let copy = Ember.copy;
// 
// function isNullOrUndefined(value) {
//   return typeof(value) === 'undefined' || value === null;
// }
// 
// function scopeWithIndex(base, index) {
//   return `${base}:eq(${index - 1})`;
// }
// 
// function extract(object, name) {
//   let attribute = object[name];
// 
//   delete object[name];
// 
//   return attribute;
// }
// 
// function preProcess(target, key, options) {
//   let definition = extract(options, 'definition');
// 
//   // don't mutate original definition
//   definition = copy(definition);
// 
//   options.itemDefinition = extract(definition, 'item');
//   options.itemScope = extract(definition, 'itemScope');
// 
//   if (isNullOrUndefined(definition.scope)) {
//     definition.scope = target.scope;
//   }
// 
//   options.scope = definition.scope;
// 
//   if (!definition.count) {
//     definition.count = count(options.itemScope);
//   }
// 
//   options.collectionComponent = definition;
// }
// 
// function getCollection(target, key, options, index) {
//   let component;
// 
//   if (index === 0) {
//     throw new Error('ember-cli-page-object collections are 1-based arrays. Use index 1 to access the first item.');
//   }
// 
//   if (index) {
//     if (target.__forceScopeToChildren) {
//       options.scope = target.scope;
//     }
// 
//     component = copy(options.itemDefinition);
//     component.scope = qualifySelector(options.scope, scopeWithIndex(options.itemScope, index));
//     component.__forceScopeToChildren = true;
//     component = create(component);
//   } else {
//     if (target.__forceScopeToChildren) {
//       options.collectionComponent.scope = target.scope;
//     }
// 
//     component = create(options.collectionComponent);
//   }
// 
//   return component;
// }
// 
// export function collection(definition) {
//   let options = { definition: copy(definition) };
// 
//   return new Descriptor(getCollection, options, preProcess);
// }
