import { Children, Context, createElement } from '@bikeshaving/crank';
import { router } from '../router';

interface Props {
  href: string;
  selected: boolean;
  children: Children;
}

export function Link(this: Context<Props, any>, { href, selected, children }: Props) {
  const handleClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    // prefixing with base url because roadtrip doesn't do it for us, but probably should
    router.goto(router.base + href);
  };

  return (
    <a class={selected ? 'selected' : ''} href={href} onclick={handleClick}>
      {children}
    </a>
  );
}
