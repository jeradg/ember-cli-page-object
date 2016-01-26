import Ceibo from 'ceibo';

function buildDescriptorWithContext(context) {
  return function(treeBuilder, target, key, value) {
    // Call the usual descriptor builder
    Ceibo.defaults.builder.descriptor(treeBuilder, target, key, value);

    if (context && !target.context) {
      target.context = context;
    }
  }
}

function buildObjectWithContext(context) {
  return function(treeBuilder, target, key, value) {
    if (context && !target.context) {
      target.context = context;
    }

    if (key !== 'context') {
      if (context && !value.context) {
        value.context = context;
      }

      // Call the usual object builder
      Ceibo.defaults.builder.object(treeBuilder, target, key, value);
    }
  };
}

// `definition` can include a key `context`, which is an
// optional integration test `this` context.
//
// If a context is passed, it is used by actions, queries, etc.,
// as the `this` in `this.$()`.
//
// If no context is passed, the global Ember acceptence test
// helpers are used.
export function create(definition, options = {}) {
  let context;

  if (definition && definition.context) {
    // If a test context is passed in the definition,
    // use it as the context
    context = definition.context;
  } else if (options && options.parent && options.parent.context) {
    // If `create()` is called by a collection, the context will
    // be in `options.parent.context` (`options.parent` is the collection)
    context = options.parent.context;
  }

  const builder = {
    object: buildObjectWithContext(context),
    descriptor: buildDescriptorWithContext(context)
  };

  if (options.builder) {
    Object.assign(options.builder, builder);
  } else {
    options.builder = builder;
  }

  return Ceibo.create(definition, options);
}
