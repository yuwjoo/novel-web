import type {
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

export type IApiSearchBookParams = ISearchParams;
export type IApiSearchBookResult = ISearchResult;

export type IApiGetBookClassifyListResult = IClassify[];

export type IApiGetBookListParams = IGetListParams;
export type IApiGetBookListResult = IGetListResult;

export type IApiGetBookDetailParams = IGetDetailParams;
export type IApiGetBookDetailResult = IBook;

export type IApiGetBookChapterListParams = IGetChapterListParams;
export type IApiGetBookChapterListResult = IChapter[];

export type IApiGetBookContentParams = IGetBookContentParams;
export type IApiGetBookContentResult = IGetBookContentResult;
