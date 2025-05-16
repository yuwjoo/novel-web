import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Chapter } from './Chapter';

@Entity('novels')
@Index(['site', 'novelId'], { unique: true }) // 确保同一站点的小说ID唯一
export class Novel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 50, comment: '来源网站标识' })
    site!: string; // e.g., 'bqg220', 'tbxsw'

    @Column({ type: 'varchar', length: 100, comment: '源站小说ID' })
    novelId!: string; // 小说在源网站的ID

    @Column({ type: 'varchar', length: 255, comment: '小说标题' })
    @Index()
    title!: string;

    @Column({ type: 'varchar', length: 100, nullable: true, comment: '作者' })
    @Index()
    author?: string;

    @Column({ type: 'varchar', length: 100, nullable: true, comment: '源站作者ID' })
    authorId?: string;

    @Column({ type: 'text', nullable: true, comment: '小说简介' })
    description?: string;

    @Column({ type: 'varchar', length: 500, nullable: true, comment: '封面图片链接' })
    coverUrl?: string;

    @Column({ type: 'varchar', length: 50, nullable: true, comment: '分类名称' })
    @Index()
    categoryName?: string;

    @Column({ type: 'varchar', length: 50, nullable: true, comment: '源站分类ID' })
    categoryId?: string;

    @Column({ type: 'varchar', length: 255, nullable: true, comment: '最新章节标题' })
    latestChapterTitle?: string;

    @Column({ type: 'varchar', length: 100, nullable: true, comment: '源站最新章节ID' })
    latestChapterId?: string;

    @Column({ type: 'varchar', length: 20, default: '连载中', comment: '小说状态 (连载中/已完结)' })
    status!: string;

    @Column({ type: 'datetime', nullable: true, comment: '最后更新日期' })
    lastUpdateTime?: Date;

    @Column({ type: 'varchar', length: 500, comment: '小说源链接' })
    sourceUrl!: string;

    @OneToMany(() => Chapter, chapter => chapter.novel, { cascade: true })
    chapters!: Chapter[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

