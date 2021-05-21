import { ApiResponse } from './ApiResponse';
import localforage from 'localforage';

// US newspaper directory for Colorado
const API_BASE_URL = 'https://chroniclingamerica.loc.gov/search/titles/results/?terms=colorado';

export async function fetchPage(pageNumber: number, pageSize: number) {
  const PREFIX = 'infinite-scroll-';

  const key = PREFIX + pageNumber;
  const hasKey = (await localforage.keys()).includes(key);

  if (!hasKey) {
    const response = await fetch(`${API_BASE_URL}&format=json&rows=${pageSize}&page=${pageNumber}`);
    if (response.status > 400) {
      throw new Error(`API Error. Status code: ${response.status}`);
    }

    const respJson = await response.json();
    await localforage.setItem(key, respJson);
  }

  const cachedResp = (await localforage.getItem(key)) as ApiResponse;
  return cachedResp;
}

export async function clearCache() {
  await localforage.clear();
}
