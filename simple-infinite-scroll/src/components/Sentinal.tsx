import { Context, Copy, createElement } from '@bikeshaving/crank';

export function* Sentinal(this: Context) {
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

  yield (
    <div class="sentinal">
      <strong>Loading more...</strong>
    </div>
  );

  try {
    for ({} of this) {
      yield <Copy />;
    }
  } finally {
    // clean up when the component is unmounted
    intersectionObserver.disconnect();
  }
}
