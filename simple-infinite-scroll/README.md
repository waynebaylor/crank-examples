# Simple Infinite Scroll

The easiest way to implement infinite scroll is to somehow detect when the user has scrolled to the bottom of the screen and then load another page of data automatically. This way the user can keep on scrolling and the screen will automatically extend without the user having to click on a Next Page button or anything. However, the downside to infinite scroll UIs is that it's difficult to get the user back to where they were if they navigate away. You would have to keep track of how many pages they had scrolled through, their scroll position, etc. So definitely put some thought into whether or not this UI pattern fits your needs.

To implement this pattern we just need a way to detect when the user has scrolled to the bottom of the screen. You could use scroll position/events to accomplish this, but here we're going to use the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). Intersection Observers let us "watch" a DOM node to see when it becomes visible or hidden. So to detect when the user has scrolled to the bottom of the page we just need to have a sentinal DOM node that we observe with an Intersection Observer. When the sentinal node is visible, then we know the user is at the bottom of the screen and we should load another page of data.

Our layout will look something like this:

```
---------------------------
|        list item        |
---------------------------
|        list item        |
---------------------------
|           ...           |
---------------------------
|        list item        |
---------------------------
|        sentinal         |
---------------------------
```

And we could translate this into jsx, where `<Sentinal/>` is our sentinal DOM node and has the Intersection Observer logic included.

```typescript
<Fragment>
  {items.map((item) => (
    <div crank-key={item.id} class="tile">
      <div class="tile-icon">...</div>
      <div class="tile-content">...</div>
    </div>
  ))}
  <Sentinal />;
</Fragment>
```

## Intersection Observer

To use an Intersection Observer we need to give it a DOM node to watch. If we look at our `<Sentnal/>` component we can see how this is done:

```typescript
// Sentinal.tsx

const intersectionObserver = new IntersectionObserver(
  (entries) => {
    const entry = entries[0]; // we're only observing 1 node
    if (entry.isIntersecting) {
      this.dispatchEvent(new CustomEvent('sentinal-visible', { bubbles: true }));
    }
  },
  { root: null, rootMargin: '0px', threshold: 1.0 }
);

this.schedule((node: Element) => {
  // wait a moment/tick for the node to get connected to the dom
  requestAnimationFrame(() => {
    intersectionObserver.observe(node);
  });
});

yield(
  <div class="sentinal">
    <strong>Loading more...</strong>
  </div>
);
```

You can see the sentinal DOM node is just a `<div>` with a message for the user. When they scroll to the bottom of the screen they'll see that message for moment until the next page of data is loaded. Once the node is rendered we call `intersectionObserver.observe(node)` to start watching it.

At the top we created an Intersection Observer instance and provided a callback to run when visibility changes, as well as a configuration object. In the callback when the node is visible `entry.isIntersecting` will be true, and then we fire an event which is listened for in a parent component.

The configuration we provide is straightforward:

- `root: null` means we want to observe the node relative to the browser's viewport.
- `rootMargin: '0px'` means don't extend the observation beyond the viewport. If we put a positive margin here we could detect the sentinal node _before_ it's visible on the screen.
- `threshold: 1.0` means only run the callback when the node is fully visible or hidden.

## Loading the Next Page

To know when to load the next page of data we just need to listen for `sentinal-visible` events that are dispatched like in the sample above. We listen for that event in the `SimpleInfiniteScroll` parent component which controls fetching another page of data and refreshing the view:

```typescript
// SimpleInfiniteScroll.tsx

this.addEventListener('sentinal-visible', async () => {
  if (hasMoreItems) {
    pageNumber += 1;
    const resp = await fetchPage(pageNumber);
    hasMoreItems = resp.totalItems !== resp.endIndex;
    items.push(...resp.items);
    this.refresh();
  }
});
```
