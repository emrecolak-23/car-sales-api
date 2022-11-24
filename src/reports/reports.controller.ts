import { Controller, Post, Body} from '@nestjs/common';

import { CreateReportDto } from './dtos/create-report.dto';

import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {

    constructor(private reportsService: ReportsService) {}

    @Post()
    createReport(@Body() dto: CreateReportDto) {
        return this.reportsService.create(dto)
    }
}
