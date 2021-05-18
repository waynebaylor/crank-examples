import { ApiResponse } from './ApiResponse';

// US newspaper directory for Colorado
const API_BASE_URL = 'https://chroniclingamerica.loc.gov/search/titles/results/?terms=colorado';

export async function fetchPage(pageNumber: number) {
  const response = await fetch(`${API_BASE_URL}&format=json&rows=10&page=${pageNumber}`);

  if (response.status > 400) {
    throw new Error(`API Error. Status code: ${response.status}`);
  }

  return (await response.json()) as ApiResponse;
}
