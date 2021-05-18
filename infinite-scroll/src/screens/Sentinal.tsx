import { Context, Copy, createElement } from '@bikeshaving/crank';

export function* Sentinal(this: Context) {
  let sentinalNode: Element;

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === sentinalNode && entry.isIntersecting) {
          this.dispatchEvent(new CustomEvent('sentinal-visible', { bubbles: true }));
        }
      });
    },
    { root: null, rootMargin: '0px', threshold: 1.0 }
  );

  this.schedule((node: Element) => {
    // wait a moment/tick for the node to get connected to the dom
    requestAnimationFrame(() => {
      intersectionObserver.observe(node);
      sentinalNode = node;
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
