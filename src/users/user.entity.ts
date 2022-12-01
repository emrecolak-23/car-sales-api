import { Report } from "../reports/report.entity";
import { AfterInsert, AfterUpdate, AfterRemove, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";


@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column({default: true})
    admin: boolean

    @Column()
    password: string

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[]

    @AfterInsert()
    logInsert() {
        console.log('Insert User with id:', this.id)
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Update User with id:', this.id)
    }

    @AfterRemove() 
    logRemove() {
        console.log('Remove User with id:', this.id)
    }

}