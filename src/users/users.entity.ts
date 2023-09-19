import { Service } from 'src/services/services.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { UserVouchCalculation } from './user-vouch/user-vouch-calculation.entity';
import { UserVouch } from './user-vouch/user-vouch.entity';

@Entity()
export class User {
    @PrimaryColumn({
        type: 'int',
        generated: true,
        update: false,
        transformer: {
            to: (value: number) => value,  // When writing to the database
            from: (value: number) => value.toString(),  // When reading from the database
        }
    })
    id: string;

    @Column()
    discordId: string;

    @Column()
    discordName: string;

    @Column()
    battleNetTag: string;

    @Column()
    email: string;

    @OneToMany(() => Service, service => service.user)
    services: Service[];

    @OneToMany(() => UserVouch, userVouch => userVouch.recipient)
    receivedVouches: UserVouch[];

    @OneToMany(() => UserVouch, userVouch => userVouch.author)
    authoredVouches: UserVouch[];

    @OneToOne(() => UserVouchCalculation, vouchCalculation => vouchCalculation.user, { eager: true, cascade: true })
    @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
    vouchCalculation: UserVouchCalculation;
}
