import { Expose, Transform } from "class-transformer";

import { User } from "src/users/user.entity";

export class ReportDto {

    @Expose()
    id: number

    @Expose()
    approved: boolean

    @Expose()
    make: string

    @Expose()
    model: string

    @Expose()
    year: number

    @Expose()
    mileage: number

    @Expose()
    lat: number

    @Expose()
    lng: number

    @Expose()
    price: number

    @Transform(({obj}) => obj.user.id)
    @Expose()
    userId: number

}