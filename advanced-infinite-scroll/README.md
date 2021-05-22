# Advanced Infinite Scroll

Let's take the [Simple Infinite Scroll](https://github.com/waynebaylor/crank-examples/tree/main/simple-infinite-scroll) concept and make a few optimizations.

There are many ways to implement "infinite scroll". A big factor in any implementation is how much control the developer takes over manipulating the DOM. We want to take some control, but still have [Crank](https://crank.js.org/) do the heavy lifting in terms of managing DOM nodes.

In the _Simple Infinite Scroll_ example our app showed a list of publications. When the user scrolls to the bottom of the listing we automatically load the next "page" of data and append it to the listing. For each page of data we load we're increasing the number of DOM nodes in the document and the amount of data stored in memory by the browser. With that in mind we're going to make the following optimizations:

1. Use tombstones as placeholders for list items that aren't currently visible.
1. Cache the data returned by the API and only load what's necessary for visible list items.
1. Be more aggressive in loading the next page of data.

## Tombstones

With an infinite scrolling UI there is no limit to how many items a user will scroll through. In the _Simple Infinite Scroll_ example all those DOM nodes are kept around even if they're not visible and the user has scrolled waaaaay past them. Tombstones are one technique for reducing the number of DOM nodes the browser has to manage in an infinite scrolling UI.

The idea is that once an item is outside the viewport we replace it with a single DOM node that acts as a placeholder. In this _Advanced Infinite Scroll_ example our list items have a fixed height, so we can use a single `<div>` as the placeholder/tombstone without affecting the scoll position.

When a list item is visible we render the following:

```html
// Page.tsx

<div crank-key={index} class="tile">
  <div class="tile-icon">
    <i class="far fa-newspaper fa-2x"></i>
  </div>
  <div class="tile-content">
    <a href={item.url.replace('.json', '')} class="tile-title">
      {item.title}
    </a>
    <span class="date-range">
      {item.start_year} &ndash; {item.end_year}
    </span>
    <div class="tile-subtitle">
      <strong>Publisher:</strong> {item.publisher}
      <br />
      <strong>Place of publication:</strong> {item.place_of_publication}
    </div>
  </div>
</div>
```

But when the user scrolls past it and it's no longer visible we replace the above with something much simpler:

```html
<div crank-key="{i}" class="tile tombstone"></div>
```

This is much simpler in terms of the number of DOM nodes involved.

## Caching API Data

We can take the same tombstone concept above and apply it to the data fetched from the API. As the user scrolls we may fetch many pages of data from the API, but we don't have to keep all of it in memory the whole time. At a minimum we only need the data required to build the currently visible parts of the UI. In this _Advanced Infinite Scroll_ example we use [LocalForage](https://localforage.github.io/localForage/) to cache the API data in the browser's IndexedDB. Each time we refresh the UI we compute what part is visible and only retreive that data from the cache.

Our caching is actually integrated into fetching the data. In this way our UI code doesn't have to know anything about caching, it just fetches a page of data.

```typescript
// apiService.ts

export async function fetchPage(pageNumber: number, pageSize: number) {
  const PREFIX = 'infinite-scroll-';

  const key = PREFIX + pageNumber;
  const hasKey = (await localforage.keys()).includes(key);

  if (!hasKey) {
    const response = await fetch(`${API_BASE_URL}&format=json&rows=${pageSize}&page=${pageNumber}`);
    if (response.status > 400) {
      throw new Error(`API Error. Status code: ${response.status}`);
    }

    const respJson = await response.json();
    await localforage.setItem(key, respJson);
  }

  const cachedResp = (await localforage.getItem(key)) as ApiResponse;
  return cachedResp;
}
```

## Loading the Next Page

In the _Simple Infinite Scroll_ example we load the next page when the user scrolls to the bottom. The downside is that the user has to wait for a moment while the next page of data loads, so the scrolling is kind of start/stop. Luckily IntersectionObserver has an option that can help us make this smoother.

In this _Advanced Infinite Scroll_ example we set the `rootMargin` option to 8 times the height of one list item. That means a new page of data will be loaded when the user is 8 items from the bottom of the listing. By loading the next page of data slightly before the user gets to the bottom we can make the scrolling experience a little smoother. The choice for `rootMargin` is somewhat arbitrary and was chosen based on experimentation.

```typescript
// BottomSentinal.tsx

const sentinalObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      this.dispatchEvent(new CustomEvent('bottom-visible', { bubbles: true }));
    }
  },
  { root: null, rootMargin: 115 * 8 + 'px', threshold: 1.0 }
);
```

To keep track of the data we maintain two maps. One for tracking which page of data is visible to the user and another for the actual API data.

```typescript
// AdvancedInfiniteScroll.tsx

const pagedVisibility = new Map<number, boolean>();
const pagedData = new Map<number, ApiItem[]>();
```

To determine which pages of data are visible to the user we use IntersectionObserver sentinals placed before and after each page of data:

```
---------------------------
|    page top sentinal    |
---------------------------
|        list item        |
---------------------------
|           ...           |
---------------------------
|        list item        |
---------------------------
|   page bottom sentinal  |
---------------------------
```

A page is considered visible if either of the sentinals is visible. However, if both sentinals are hidden then we consider the page to be hidden.

Each sentinal fires an event when it becomes visible/hidden, for example:

```typescript
// PageTopSentinal.tsx

new IntersectionObserver(
  (entries) => {
    this.dispatchEvent(new CustomEvent('page-top-visibility', { bubbles: true, detail: { visible: entries[0].isIntersecting } }));
  },
  { root: null, rootMargin: '0px', threshold: 1.0 }
);
```

These events are then rolled up by the parent component to determine overall page visiblity:

```typescript
// Page.tsx

let pageTopVisible: boolean = true;
let pageBottomVisible: boolean = true;

const maybeDispatchPageEvent = () => {
  if (pageTopVisible || pageBottomVisible) {
    this.dispatchEvent(new CustomEvent('page-visibility', { bubbles: true, detail: { pageNumber, visible: true } }));
  } else if (!pageTopVisible && !pageBottomVisible) {
    this.dispatchEvent(new CustomEvent('page-visibility', { bubbles: true, detail: { pageNumber, visible: false } }));
  }
};

this.addEventListener('page-top-visibility', (event) => {
  pageTopVisible = (event as CustomEvent).detail.visible;
  maybeDispatchPageEvent();
});

this.addEventListener('page-bottom-visibility', (event) => {
  pageBottomVisible = (event as CustomEvent).detail.visible;
  maybeDispatchPageEvent();
});
```

Finally, the page visibility events are captured and that's what determines the data we display to the user:

```typescript
// AdvancedInfiniteScroll.tsx

this.addEventListener('page-visibility', async (event) => {
  const { pageNumber, visible } = (event as CustomEvent).detail;
  pagedVisibility.set(pageNumber, visible);

  // these events can fire rapidly, so let's delay refreshing a bit to see if another event comes in.
  if (!isNaN(refreshHandle)) {
    clearTimeout(refreshHandle);
  }

  refreshHandle = setTimeout(async () => {
    for (const [pageNum, isVisible] of pagedVisibility) {
      if (isVisible) {
        const resp = await fetchPage(pageNum, PAGE_SIZE);
        pagedData.set(pageNum, resp.items);
      } else {
        pagedData.set(pageNum, []);
      }
    }
    this.refresh();
  }, 100);
});
```
