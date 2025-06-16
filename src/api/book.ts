import { useCrawler } from "@/crawler";
import { useBookPlatform } from "@/store/bookPlatform";
import type {
  IApiSearchBookParams,
  IApiSearchBookResult,
  IApiGetBookClassifyListResult,
  IApiGetBookListParams,
  IApiGetBookListResult,
  IApiGetBookDetailParams,
  IApiGetBookDetailResult,
  IApiGetBookChapterListParams,
  IApiGetBookChapterListResult,
  IApiGetBookContentParams,
  IApiGetBookContentResult
} from "./type";

const bookPlatform = useBookPlatform();

export function searchBook(params: IApiSearchBookParams): Promise<IApiSearchBookResult> {
  return useCrawler().books[bookPlatform.currentPlatformKey].search(params);
}

export function getBookClassifyList(): Promise<IApiGetBookClassifyListResult> {
  return useCrawler().books[bookPlatform.currentPlatformKey].getClassifyList();
}

export function getBookList(params: IApiGetBookListParams): Promise<IApiGetBookListResult> {
  return useCrawler().books[bookPlatform.currentPlatformKey].getList(params);
}

export function getBookDetail(params: IApiGetBookDetailParams): Promise<IApiGetBookDetailResult> {
  return useCrawler().books[bookPlatform.currentPlatformKey].getDetail(params);
}

export function getBookChapterList(params: IApiGetBookChapterListParams): Promise<IApiGetBookChapterListResult> {
  return useCrawler().books[bookPlatform.currentPlatformKey].getChapterList(params);
}

export function getBookContent(params: IApiGetBookContentParams): Promise<IApiGetBookContentResult> {
  return useCrawler().books[bookPlatform.currentPlatformKey].getBookContent(params);
}
