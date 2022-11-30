import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { User } from 'src/users/user.entity';

import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

    createEstimate(estimateDto: GetEstimateDto) {
        return this.repo.createQueryBuilder().select('*').where('make = :make', { make: estimateDto.make }).getRawMany()
    }

    create(dto: CreateReportDto, user: User) {
        const report = this.repo.create(dto)
        report.user = user
        return this.repo.save(report)
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({where: {id: parseInt(id)}})
        if(!report) throw new NotFoundException('Report not found')
        report.approved = approved
        return this.repo.save(report)
    }
}
