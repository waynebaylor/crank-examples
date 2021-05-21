import { Context, Copy, createElement } from '@bikeshaving/crank';

interface Props {}

export function* PageTopSentinal(this: Context<Props, any>, _props: Props) {
  const sentinalObserver = new IntersectionObserver(
    (entries) => {
      this.dispatchEvent(new CustomEvent('page-top-visibility', { bubbles: true, detail: { visible: entries[0].isIntersecting } }));
    },
    { root: null, rootMargin: '0px', threshold: 1.0 }
  );

  this.schedule((node: Element) => {
    // wait a moment/tick for the node to get connected to the dom
    requestAnimationFrame(() => {
      sentinalObserver.observe(node);
    });
  });

  yield <div class="page-top-sentinal"></div>;

  try {
    for ({} of this) {
      yield <Copy />;
    }
  } finally {
    // clean up when the component is unmounted
    sentinalObserver.disconnect();
  }
}
