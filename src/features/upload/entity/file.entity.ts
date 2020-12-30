import {Entity, Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "@features/user";

@Entity()
export class File {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    name: string;

    @Column("int")
    size: number;

    @Column("varchar")
    extension: string;

    @Column("varchar")
    url: string;

    @ManyToOne(type => User)
    user: User; 

    getPublicData(): FilePublicData {
        const {id, name, size, extension, url} = this;

        return {id, name, size, extension, url};
    }
}

export interface FilePublicData {
    id: string;
    name: string;
    size: number;
    extension: string;
    url: string;
}