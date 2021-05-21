import { Context, createElement, Fragment } from '@bikeshaving/crank';
import { ApiItem } from '../ApiResponse';
import { PageBottomSentinal } from './PageBottomSentinal';
import { PageTopSentinal } from './PageTopSentinal';

interface Props {
  pageSize: number;
  pageNumber: number;
  items: ApiItem[];
}

export function* Page(this: Context<Props, any>, _props: Props) {
  let pageNumber = _props.pageNumber;
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

  for (const props of this) {
    const { pageSize, items } = props;
    pageNumber = props.pageNumber;

    if (items.length === 0) {
      const tombstones = [];
      for (let i = 0; i < pageSize; i++) {
        tombstones.push(<div crank-key={i} class="tile tombstone"></div>);
      }
      yield (
        <Fragment>
          <PageTopSentinal />
          {tombstones}
          <PageBottomSentinal />
        </Fragment>
      );
    } else {
      yield (
        <Fragment>
          <PageTopSentinal />
          {items.map((item, index) => (
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
          ))}
          <PageBottomSentinal />
        </Fragment>
      );
    }
  }
}
