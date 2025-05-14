import { Author } from "./author";
import { Chapter } from "./chapter";
import { Classify } from "./classify";

export interface Book {
  id: string; // id
  title: string; // 标题
  cover: string; // 封面
  intro: string; // 简介
  author: Author; // 作者
  classify: Classify; // 分类
  updateDate: string; // 更新日期
  lastChapter: Chapter; // 最新章节
  state: -1 | 0 | 1; // 状态："未知" | "连载" | "完结"
  bookOrigin: string; // 小说源
}
