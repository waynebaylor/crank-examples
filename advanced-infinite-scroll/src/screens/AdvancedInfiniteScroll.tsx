import { Context, createElement, Fragment } from '@bikeshaving/crank';
import { ApiItem } from '../ApiResponse';
import { clearCache, fetchPage } from '../apiService';
import { Header, Listing } from '../components';
import { BottomSentinal } from '../components/BottomSentinal';

interface Props {}

export async function* AdvancedInfiniteScroll(this: Context<Props, any>, _props: Props) {
  const PAGE_SIZE = 10;
  const pagedVisibility = new Map<number, boolean>();
  const pagedData = new Map<number, ApiItem[]>();
  let refreshHandle: number;

  this.addEventListener('clear-cache', async () => {
    await clearCache();
    pagedData.clear();

    this.refresh();
  });

  this.addEventListener('bottom-visible', async () => {
    const nextPageNumber = Math.max(0, ...pagedData.keys()) + 1;
    const resp = await fetchPage(nextPageNumber, PAGE_SIZE);
    pagedData.set(nextPageNumber, resp.items);

    this.refresh();
  });

  this.addEventListener('page-visibility', async (event) => {
    const { pageNumber, visible } = (event as CustomEvent).detail;
    pagedVisibility.set(pageNumber, visible);

    // these events can fire rapidly, so let's delay refreshing a bit to see if another event comes in.
    if (!isNaN(refreshHandle)) {
      console.log('skipping refresh', refreshHandle);
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

  for await ({} of this) {
    yield (
      <div class="container grid-lg">
        <Header />
        {pagedData.size === 0 && (
          <Fragment>
            <BottomSentinal /> {/* this is here to trigger loading the first page of data */}
            <div class="hero">
              <h1 class="text-center text-gray">Loading...</h1>
              <div class="loading loading-lg"></div>
            </div>
          </Fragment>
        )}
        {pagedData.size > 0 && <Listing data={pagedData} pageSize={PAGE_SIZE} />}
      </div>
    );
  }
}
