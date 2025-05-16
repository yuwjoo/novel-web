import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Novel } from './Novel';

@Entity('chapters')
@Index(['novel', 'chapterId'], { unique: true }) // 确保同一本小说的章节ID唯一
@Index(['novel', 'order'], { unique: true })    // 确保同一本小说的章节顺序唯一
export class Chapter {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Novel, novel => novel.chapters, { onDelete: 'CASCADE' }) // onDelete CASCADE 意味着删除小说时，其所有章节也会被删除
    novel!: Novel;

    @Column({ type: 'varchar', length: 100, comment: '源站章节ID' })
    chapterId!: string; // 章节在源网站的ID

    @Column({ type: 'varchar', length: 255, comment: '章节标题' })
    title!: string;

    @Column({ type: 'int', comment: '章节顺序' })
    order!: number; // 从1开始的章节顺序

    @Column({ type: 'varchar', length: 500, comment: '章节源链接' })
    sourceUrl!: string;

    @Column({ type: 'text', nullable: true, comment: '章节内容' })
    content?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

