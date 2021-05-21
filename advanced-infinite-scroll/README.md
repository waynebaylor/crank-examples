# Advanced Infinite Scroll

We take the [Simple Infinite Scroll](https://github.com/waynebaylor/crank-examples/tree/main/simple-infinite-scroll) concept and make a few optimizations.

There are many ways to implement "infinite scroll". A big factor in any implementation is how much control the developer takes over manipulating the DOM. We want to take some control, but still have Crank do the heavy lifting in terms of managing DOM nodes.

In the _Simple Infinite Scroll_ example our app showed a list of publications. When you scroll to the bottom of the listing we automatically load the next "page" of data and append it to the listing. For each page of data we load we're increasing the number of DOM nodes in the document and the amount of data stored in memory by the browser. With that in mind we're going to make the following optimizations:

1. Use tombstones as placeholders for list items that aren't currently visible.
1. Cache the data returned by the API and only load what's necessary for visible list items.
1. Be more aggressive in loading the next page of data.

...more to come...
