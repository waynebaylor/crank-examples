import { Context, createElement } from '@bikeshaving/crank';

export function Header(this: Context) {
  const clearCachedData = async () => {
    this.dispatchEvent(new CustomEvent('clear-cache', { bubbles: true }));
  };

  return (
    <header>
      <h1>Advanced Infinite Scroll</h1>
      <div>
        <button type="button" class="btn btn-error" title="Clear cached data" onclick={clearCachedData}>
          Clear Cache
        </button>
      </div>
    </header>
  );
}
