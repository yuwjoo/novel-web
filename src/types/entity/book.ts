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
  origin: string; // 小说源
}
