import { Game } from '@diablosnaps/common';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiabloItemAffix } from './diablo-item-affix.entity';

@Entity({ name: 'diabloItem' })
export class DiabloItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', nullable: false, default: 'uuid_generate_v4()' })
    uuid: string;

    @Column({ nullable: true })
    quality: Game.ItemQuality;

    @Column({ nullable: true })
    variant: Game.ItemVariant;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    power: number;

    @Column({ nullable: true })
    type: Game.ItemType;

    @Column({ nullable: true })
    dps: number;

    @Column({ nullable: true })
    armor: number;

    @Column({ nullable: true })
    socketCount: number;

    @Column({ nullable: true })
    socketType: Game.ItemSocketType;

    @Column({ nullable: true })
    requiredLevel: number;

    @Column({ nullable: true })
    classRestriction: Game.Class;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'inherentAffix0Id' })
    inherentAffix0: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    inherentAffix0Value: number;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'inherentAffix1Id' })
    inherentAffix1: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    inherentAffix1Value: number;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'affix0Id' })
    affix0: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    affix0Value: number;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'affix1Id' })
    affix1: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    affix1Value: number;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'affix2Id' })
    affix2: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    affix2Value: number;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'affix3Id' })
    affix3: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    affix3Value: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;
}
