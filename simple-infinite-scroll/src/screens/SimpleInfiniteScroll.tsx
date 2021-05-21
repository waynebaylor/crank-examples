import { Context, createElement } from '@bikeshaving/crank';
import { ApiItem } from '../ApiResponse';
import { fetchPage } from '../apiService';
import { Header } from '../components';
import { Listing } from '../components';

interface Props {}

export async function* SimpleInfiniteScroll(this: Context<Props, any>, _props: Props) {
  let pageNumber = 1;
  let items: ApiItem[] = [];
  let hasMoreItems = true;

  this.addEventListener('sentinal-visible', async () => {
    if (hasMoreItems) {
      pageNumber += 1;
      const resp = await fetchPage(pageNumber);
      hasMoreItems = resp.totalItems !== resp.endIndex;
      items.push(...resp.items);
      this.refresh();
    }
  });

  this.schedule(async () => {
    const resp = await fetchPage(pageNumber);
    hasMoreItems = resp.totalItems !== resp.endIndex;
    items.push(...resp.items);
    this.refresh();
  });

  for await ({} of this) {
    yield (
      <div class="container grid-lg">
        <Header />
        {items.length === 0 && (
          <div class="hero">
            <h1 class="text-center text-gray">Loading...</h1>
            <div class="loading loading-lg"></div>
          </div>
        )}
        {items.length > 0 && <Listing items={items} hasMoreItems={hasMoreItems} />}
      </div>
    );
  }
}
