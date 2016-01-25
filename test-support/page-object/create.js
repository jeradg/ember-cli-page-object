import Ceibo from 'ceibo';

function typeOf(item) {
  if (item && item.isDescriptor) {
    return 'descriptor';
  }

  if (item === null) {
    return 'null';
  }

  return typeof(item);
}

// Cribbed from Ceibo
function defineProperty(target, keyName, value, getter) {
  var options = {
    configurable: true,
    enumerable: true,
  };

  if (typeOf(getter) !== 'undefined') {
    options.get = getter;
  } else {
    options.writable = false;
    options.value = value;
  }

  Object.defineProperty(target, keyName, options);
}

function buildDescriptorWithContext(context) {
  // Cribbed from Ceibo
  return function(treeBuilder, target, key, attr) {
    if (typeof attr.setup === 'function') {
      attr.setup(target, key);
    }

    defineProperty(target, key, attr.value, attr.get);

    if (!target.context) {
      target.context = context;
    }
  }
}

function buildObjectWithContext(context) {
  // Cribbed from Ceibo
  return function(treeBuilder, target, keyName, value) {
    let object = {};

    if (!target.context) {
      target.context = context;
    }

    if (keyName !== 'context') {
      // Create child component
      defineProperty(target, keyName, object);

      if (!value.context) {
        value.context = context;
      }

      // Recursion
      treeBuilder.processNode(value, object, target);
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
