import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('categories')
@Index(['site', 'categoryId'], { unique: true }) // 确保同一站点的分类ID唯一
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 50, comment: '来源网站标识' })
    site!: string; // e.g., 'bqg220', 'tbxsw'

    @Column({ type: 'varchar', length: 100, comment: '源站分类ID' })
    categoryId!: string; // 分类在源网站的ID

    @Column({ type: 'varchar', length: 100, comment: '分类名称' })
    @Index()
    name!: string;

    @Column({ type: 'varchar', length: 500, comment: '分类源链接' })
    sourceUrl!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

