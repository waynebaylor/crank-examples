export interface ApiItem {
  id: string;
  title: string;
  publisher: string;
  place_of_publication: string;
  start_year: number;
  end_year: number;
  frequency: string;
  url: string;
}

export interface ApiResponse {
  totalItems: number;
  startIndex: number;
  endIndex: number;
  itemsPerPage: number;
  items: ApiItem[];
}
