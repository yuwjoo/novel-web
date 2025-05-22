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
} from "@/crawler/books/type";
import { IBookExtraParams } from "./type";
import { useCrawler } from "@/crawler";

export function searchBook(params: ISearchParams & IBookExtraParams): Promise<ISearchResult> {
  return useCrawler().books["lengku8"].search(params);
}

export function getBookClassifyList(_params: IBookExtraParams): Promise<IClassify[]> {
  return useCrawler().books["lengku8"].getClassifyList();
}

export function getBookList(params: IGetListParams & IBookExtraParams): Promise<IGetListResult> {
  return useCrawler().books["lengku8"].getList(params);
}

export function getBookDetail(params: IGetDetailParams & IBookExtraParams): Promise<IBook> {
  return useCrawler().books["lengku8"].getDetail(params);
}

export function getBookChapterList(params: IGetChapterListParams & IBookExtraParams): Promise<IChapter[]> {
  return useCrawler().books["lengku8"].getChapterList(params);
}

export function getBookContent(params: IGetBookContentParams & IBookExtraParams): Promise<IGetBookContentResult> {
  return useCrawler().books["lengku8"].getBookContent(params);
}
