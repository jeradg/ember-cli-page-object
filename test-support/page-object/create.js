import Ceibo from 'ceibo';

function buildDescriptorWithContext(context) {
  // Cribbed from Ceibo
  return function(treeBuilder, target, key, value) {
    Ceibo.defaults.builder.descriptor(treeBuilder, target, key, value);

    if (!target.context) {
      target.context = context;
    }
  }
}

function buildObjectWithContext(context) {
  // Cribbed from Ceibo
  return function(treeBuilder, target, key, value) {
    if (!target.context) {
      target.context = context;
    }

    if (key !== 'context') {
      if (!value.context) {
        value.context = context;
      }

      Ceibo.defaults.builder.object(treeBuilder, target, key, value);
    }
  };
}

export function create(definition, options = {}) {
  let context;

  if (definition && definition.context) {
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
