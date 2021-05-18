import { createElement } from '@bikeshaving/crank';
import page from 'page';

export function Header() {
  return (
    <header>
      <h1>Simple Infinite Scroll</h1>
      <div class="links">
        <button type="button" class="btn btn-primary" title="Simple infinite scroll" onclick={() => page('/simple')}>
          Simple
        </button>
        <button type="button" class="btn btn-link">
          Advanced
        </button>
      </div>
    </header>
  );
}
