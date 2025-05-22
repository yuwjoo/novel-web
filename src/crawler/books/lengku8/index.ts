import { IBookCrawler, IOrigin } from "@/crawler/books/type";
import { search } from "./api/search";
import { getClassifyList } from "./api/getClassifyList";
import { getList } from "./api/getList";
import { getDetail } from "./api/getDetail";
import { getChapterList } from "./api/getChapterList";
import { getBookContent } from "./api/getBookContent";

export const bookOrigin: IOrigin = {
  key: "lengku8",
  name: "冷酷文学",
  url: "https://www3.lengku8.cc"
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
