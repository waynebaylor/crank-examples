import { Context, Copy, createElement } from '@bikeshaving/crank';

interface Props {}

export function* BottomSentinal(this: Context<Props, any>, _props: Props) {
  const sentinalObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        this.dispatchEvent(new CustomEvent('bottom-visible', { bubbles: true }));
      }
    },
    { root: null, rootMargin: 115 * 8 + 'px', threshold: 1.0 }
  );

  this.schedule((node: Element) => {
    // wait a moment/tick for the node to get connected to the dom
    requestAnimationFrame(() => {
      sentinalObserver.observe(node);
    });
  });

  yield <div></div>;

  try {
    for ({} of this) {
      yield <Copy />;
    }
  } finally {
    // clean up when the component is unmounted
    sentinalObserver.disconnect();
  }
}
