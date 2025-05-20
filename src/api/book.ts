import lengku8Crawler from "@/crawler/sources/lengku8";
import {
  IBook,
  IChapter,
  IClassify,
  IGetBookContentParams,
  IGetBookContentResult,
  IGetChapterListParams,
  IGetDetailParams,
  IGetListParams,
  IGetListResult,
  ISearchParams,
  ISearchResult
} from "@/crawler/type";
import { IBookExtraParams } from "./type";

export function searchBook(params: ISearchParams & IBookExtraParams): Promise<ISearchResult> {
  return lengku8Crawler.search(params);
}

export function getBookClassifyList(_params: IBookExtraParams): Promise<IClassify[]> {
  return lengku8Crawler.getClassifyList();
}

export function getBookList(params: IGetListParams & IBookExtraParams): Promise<IGetListResult> {
  return lengku8Crawler.getList(params);
}

export function getBookDetail(params: IGetDetailParams & IBookExtraParams): Promise<IBook> {
  return lengku8Crawler.getDetail(params);
}

export function getBookChapterList(params: IGetChapterListParams & IBookExtraParams): Promise<IChapter[]> {
  return lengku8Crawler.getChapterList(params);
}

export function getBookContent(params: IGetBookContentParams & IBookExtraParams): Promise<IGetBookContentResult> {
  return lengku8Crawler.getBookContent(params);
}
