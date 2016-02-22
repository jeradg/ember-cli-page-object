---
layout: page
title: Options
---

A set of options can be passed as parameters when defining attributes.

* [scope](#scope)
* [index](#index)

## scope

The `scope` option can be used to override the page `scope` configuration.

Given the following HTML

```html
<div class="article">
  <p>Lorem ipsum dolor</p>
</div>
<div class="footer">
  <p>Copyright 2016 - Acme Inc.</p>
</p>
```

the following configuration will match the footer element

```js
const { text } = PageObject;

var page = PageObject.create({
  scope: '.article',

  textBody: text('p'),

  copyrightNotice: text('p', { scope: '.footer' })
});

andThen(function() {
  assert.equal(page.copyrightNotice(), 'Copyright 2015 - Acme Inc.');
});
```

## index

The `index` option can be used to reduce the set of matched elements to the one at the specified index.

Given the following HTML

```html
<span>Lorem</span>
<span>ipsum</span>
<span>dolor</span>
```

the following configuration will match the second `span` element

```js
const { text } = PageObject;

var page = PageObject.create({
  word: text('span', { index: 2 })
});

andThen(function() {
  assert.equal(page.word(), 'ipsum'); // => ok
});
```
