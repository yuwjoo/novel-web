import {
  IBook,
  IChapter,
  IClassify,
  IBookCrawler,
  IGetBookContentParams,
  IGetBookContentResult,
  IGetChapterListParams,
  IGetDetailParams,
  IGetListParams,
  IGetListResult,
  ISearchParams,
  ISearchResult,
  IBookOrigin
} from "../type";
import { BaseCrawler } from "../baseCrawler";

class BookCrawler extends BaseCrawler implements IBookCrawler {
  origin: IBookOrigin = {
    key: "lengku8",
    name: "冷酷文学",
    url: "https://www3.lengku8.cc"
  };

  async search(params: ISearchParams): Promise<ISearchResult> {
    const res = await this.fetch.get(`https://www3.lengku8.cc/search/${params.searchValue}/${params.current}`);
    const $ = this.parseHTML(res.data);

    const list: ISearchResult["list"] = [];
    $(".SHsectionThree-middle p").each((i, el) => {
      const span = $(el).children("span");
      list.push({
        id: span.eq(1).children("a").attr("href")?.match(/\d+/)?.[0] || "",
        classify: {
          id: span.eq(0).children("a").attr("href")?.match(/\d+/)?.[0] || "",
          name: span.eq(0).children("a").text()
        },
        title: span.eq(1).children("a").text(),
        author: {
          id: span.eq(2).children("a").attr("href")?.match(/\d+/)?.[0] || "",
          name: span.eq(2).children("a").text()
        },
        bookOrigin: this.origin
      });
    });
    const current = Number($(".CGsectionTwo-right-bottom-detail span").eq(0).text() || 0);
    const size = list.length;
    const total = Number($(".CGsectionTwo-right-bottom-detail span").eq(1).text() || 0) * size;

    return { list, current, size, total };
  }

  async getClassifyList(): Promise<IClassify[]> {
    const res = await this.fetch.get(`https://www3.lengku8.cc/category/`);
    const $ = this.parseHTML(res.data);

    const list: IClassify[] = [];
    $(".CGsectionTwo-left a").each((i, el) => {
      if (!$(el).text()) return;
      list.push({
        id: $(el).attr("href")!.match(/\d+/)![0],
        name: $(el).text()
      });
    });

    return list;
  }

  async getList(params: IGetListParams): Promise<IGetListResult> {
    const res = await this.fetch.get(`https://www3.lengku8.cc/category/${params.classifyId}/${params.current}.html`);
    const $ = this.parseHTML(res.data);

    const listPromise = $(".CGsectionTwo-right-content")
      .children()
      .map<Promise<IBook>>((_i, el) => {
        const id =
          $(el)
            .find(".title")
            .attr("href")
            ?.match(/\/book\/(\d+)\//)?.[1] || "";
        if (params.noImageMode) {
          const title = $(el).find(".title").text();
          const author = $(el).find("a.b").text();
          const authorId = $(el)
            .find("a.b")
            .attr("href")!
            .match(/\/writer\/(\d+)\//)![1]; // 作者id
          const intro = $(el).children("p").eq(2).text();
          const updateDate =
            $(el)
              .children("p")
              .eq(3)
              .text()
              .match(/[\d-]+/)?.[0] || "";
          return Promise.resolve({
            id,
            title,
            cover: "",
            intro,
            author: {
              id: authorId,
              name: author
            },
            classify: {
              id: "",
              name: ""
            },
            updateDate,
            lastChapter: {
              id: "",
              title: "",
              isLock: false
            },
            state: -1,
            bookOrigin: this.origin
          });
        } else {
          return this.getDetail({ id });
        }
      })
      .toArray();
    const list = await Promise.all(listPromise);
    const current = Number($(".CGsectionTwo-right-bottom-detail span").eq(0).text() || 0);
    const size = Number($(".CGsectionTwo-right-bottom-detail span").eq(2).text() || 0);
    const total = Number($(".CGsectionTwo-right-bottom-detail span").eq(1).text() || 0) * size;

    return { current, size, total, list };
  }

  async getDetail(params: IGetDetailParams): Promise<IBook> {
    const res = await this.fetch.get(`https://www3.lengku8.cc/book/${params.id}/`);
    const $ = this.parseHTML(res.data);

    const title = $(".BGsectionOne-top-right .title").eq(0).text(); // 标题
    const author = $(".BGsectionOne-top-right .author .b").eq(0).text(); // 作者
    const authorId = $(".BGsectionOne-top-right .author .b")
      .eq(0)
      .attr("href")!
      .match(/\/writer\/(\d+)\//)![1]; // 作者id
    const categorys = $(".BGsectionOne-top-right .category")
      .eq(0)
      .children("span")
      .map((i, el) => $(el).text())
      .toArray(); // 类别
    const classifyId =
      $(".BGsectionOne-top-right .category").eq(0).find("span a").eq(0).attr("href")?.match(/\d+/)?.[0] || ""; // 分类id
    const updateDate = $(".BGsectionOne-top-right .time").eq(0).children("span").text(); // 更新时间
    const cover = $(".BGsectionOne-top-left .lazyload").attr("_src") || ""; // 封面
    const intro = $(".BGsectionTwo-bottom").text(); // 简介
    const lastChapter = $(".BGsectionOne-top-right .newestChapter .r").text(); // 最新章节
    const lastChapterId =
      $(".BGsectionOne-top-right .newestChapter .r")
        .attr("href")
        ?.match(/(\d+)\.html/)?.[1] || ""; // 最新章节id

    return {
      id: params.id,
      title,
      cover,
      intro,
      author: {
        id: authorId,
        name: author
      },
      classify: {
        id: classifyId,
        name: categorys[0]
      },
      updateDate,
      lastChapter: {
        id: lastChapterId,
        title: lastChapter,
        isLock: false
      },
      state: ["连载", "完结"].indexOf(categorys[2]) as IBook["state"],
      bookOrigin: this.origin
    };
  }

  async getChapterList(params: IGetChapterListParams): Promise<IChapter[]> {
    const list: IChapter[] = [];
    let currentPage = 1;
    let totalPage = 0;
    do {
      const res = await this.fetch.get(`https://www3.lengku8.cc/book/${params.id}/catalog/${currentPage}.html`);
      const $ = this.parseHTML(res.data);

      const originalOrderArrStr = res.data.match(/var originalOrder = \[(.+)\];/)?.[1]; // 章节排序映射规则数组字符串
      const tempList: IChapter[] = [];

      if (originalOrderArrStr) {
        const originalOrder = originalOrderArrStr.split(","); // 章节排序映射规则
        $(".BCsectionTwo-top .BCsectionTwo-top-chapter a").each((i, el) => {
          tempList[originalOrder[i]] = {
            id: $(el)
              .attr("href")!
              .match(/(\d+)\.html/)![1],
            title: $(el).attr("data-real")!,
            isLock: false
          };
        });
      } else {
        $(".BCsectionTwo-top .BCsectionTwo-top-chapter").each((i, el) => {
          const pos = $(el).attr("data-x")!;
          const a = $(el).children("a");
          if (a.attr("data-link")) {
            tempList[pos] = {
              id: atob(a.attr("data-link")!).match(/(\d+)\.html/)![1],
              title: a.attr("abc-title")!
            };
          } else {
            tempList[pos] = {
              id: atob(a.attr("data-sb")!).match(/(\d+)\.html/)![1],
              title: a.attr("uc-title")!
            };
          }
        });
      }

      list.push(...tempList);
      totalPage = Number($(".CGsectionTwo-right-bottom-detail span").eq(1).text() || 0);
      currentPage++;
    } while (currentPage <= totalPage);

    return list;
  }

  async getBookContent(params: IGetBookContentParams): Promise<IGetBookContentResult> {
    const res = await this.fetch.get(`https://www3.lengku8.cc/book/${params.id}/${params.chapterId}.html`);
    const $ = this.parseHTML(res.data);

    const paragraphs: string[] = [];
    let isEnd = false;
    $(".RBGsectionThree-content p").each((i, el) => {
      if ($(el).attr("style") === "color:orange;") isEnd = true;
      if (isEnd) return;
      paragraphs.push($(el).text());
    });
    const title = $("#chapterTitle").text(); // 章节标题
    const prevChapterId = ($(".RBGsectionTwo-left .qian_page")
      .attr("href")!
      .match(/(\d+)\.html/) || [])![1]; // 上一章id
    const nextChapterId = ($(".RBGsectionTwo-right .hou_page")
      .eq(0)
      .attr("href")!
      .match(/(\d+)\.html/) || [])![1]; // 下一章id

    return { chapterId: params.chapterId, title, paragraphs, prevChapterId, nextChapterId };
  }
}

export default new BookCrawler();
