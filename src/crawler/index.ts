import bookCrawlerLengku8 from "./books/lengku8";
import bookCrawlerTbxsw from "./books/tbxsw";

const crawler = {
  books: {
    [bookCrawlerLengku8.origin.key]: bookCrawlerLengku8,
    [bookCrawlerTbxsw.origin.key]: bookCrawlerTbxsw
  }
} as const;

export function useCrawler() {
  return crawler;
}
