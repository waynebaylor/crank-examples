import { Context, createElement } from '@bikeshaving/crank';
import { ApiItem } from '../ApiResponse';
import { BottomSentinal } from './BottomSentinal';
import { Page } from './Page';

interface Props {
  data: Map<number, ApiItem[]>;
  pageSize: number;
}

export function* Listing(this: Context<Props, any>, _props: Props) {
  for (const { data, pageSize } of this) {
    yield (
      <div class="listing">
        <h2>US Newspaper Directory: Colorado</h2>
        <p class="subtitle">
          <em>
            Data provided by <a href="https://chroniclingamerica.loc.gov">https://chroniclingamerica.loc.gov</a>
          </em>
        </p>
        {Array.from(data, ([pageNumber, items]) => (
          <Page crank-key={pageNumber} pageSize={pageSize} pageNumber={pageNumber} items={items} />
        ))}
        <BottomSentinal />
      </div>
    );
  }
}
