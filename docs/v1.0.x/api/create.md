---
layout: page
title: Create
---

### Methods

- [create](#create)

## create

[test-support/page-object/create.js:101-107](https://github.com/jeradg/ember-cli-page-object/blob/e5310a3d642563214536f01aae7211922b009cea/test-support/page-object/create.js#L101-L107 "Source code on GitHub")

Creates a new PageObject.

By default, the resulting PageObject will respond to:

-   **Actions**: click, clickOn
-   **Predicates**: contains, isHidden, isVisible
-   **Queries**: text

**Parameters**

-   `definition` **Object** PageObject definition
-   `options` **Object** [private] Ceibo options. Do not use!

**Examples**

```javascript
// <div class="title">My title</div>

import PageObject, { text } from 'frontend/tests/page-object';

const page = PageObject.create({
  title: text('.title')
});

assert.equal(page.title, 'My title');
```

```javascript
// <div id="my-page">
//   My super text
//   <button>Press Me</button>
// </div>

const page = PageObject.create({
  scope: '#my-page'
});

assert.equal(page.text, 'My super text');
assert.ok(page.contains('super'));
assert.ok(page.isVisible);
assert.notOk(page.isHidden);

// clicks div#my-page
page.click();

// clicks button
page.clickOn('Press Me');
```

Returns **PageObject** 
