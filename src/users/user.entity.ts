import { AfterInsert, AfterUpdate, AfterRemove, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

import { Exclude } from "class-transformer";

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    @Exclude()
    password: string

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