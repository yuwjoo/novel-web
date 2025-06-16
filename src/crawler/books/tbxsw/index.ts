import type { IBookCrawler, IOrigin } from "@/crawler/books/type";
import { search } from "./api/search";
import { getClassifyList } from "./api/getClassifyList";
import { getList } from "./api/getList";
import { getDetail } from "./api/getDetail";
import { getChapterList } from "./api/getChapterList";
import { getBookContent } from "./api/getBookContent";

export const bookOrigin: IOrigin = {
  key: "tbxsw",
  name: "官术网",
  url: "https://m.tbxsw.cc/"
};

const bookCrawler: IBookCrawler = {
  origin: bookOrigin,
  search,
  getClassifyList,
  getList,
  getDetail,
  getChapterList,
  getBookContent
};

export default bookCrawler;
