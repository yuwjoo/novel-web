import { useBook } from "@/store/book";
import { crawlers } from "@/utils/crawler";
import type {
  ApiSearchBookParams,
  ApiSearchBookResult,
  ApiGetBookClassifyListResult,
  ApiGetBookListParams,
  ApiGetBookListResult,
  ApiGetBookDetailParams,
  ApiGetBookDetailResult,
  ApiGetBookAllChapterListParams,
  ApiGetBookAllChapterListResult,
  ApiGetBookContentParams,
  ApiGetBookContentResult
} from "./types/book";

const bookStore = useBook();

const currentBookCrawler = computed(() => {
  switch (bookStore.bookPlatform.current) {
    case crawlers.lengku8.meta.name:
      return crawlers.lengku8;
    case crawlers.tbxsw.meta.name:
      return crawlers.tbxsw;
    default:
      return crawlers.lengku8;
  }
});

export function searchBook(params: ApiSearchBookParams): Promise<ApiSearchBookResult> {
  return currentBookCrawler.value.search(params);
}

export function getBookClassifyList(): Promise<ApiGetBookClassifyListResult> {
  return currentBookCrawler.value.getClassifyList();
}

export function getBookList(params: ApiGetBookListParams): Promise<ApiGetBookListResult> {
  return currentBookCrawler.value.getList(params);
}

export function getBookDetail(params: ApiGetBookDetailParams): Promise<ApiGetBookDetailResult> {
  return currentBookCrawler.value.getDetail(params);
}

export function getBookAllChapterList(params: ApiGetBookAllChapterListParams): Promise<ApiGetBookAllChapterListResult> {
  return currentBookCrawler.value.getAllChapterList(params);
}

export function getBookContent(params: ApiGetBookContentParams): Promise<ApiGetBookContentResult> {
  return currentBookCrawler.value.getBookContent(params);
}
