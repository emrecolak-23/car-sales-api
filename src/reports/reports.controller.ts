import { Controller, Post, Body, UseGuards, Patch, Param, Get, Query} from '@nestjs/common';

import { CreateReportDto } from './dtos/create-report.dto';

import { ReportsService } from './reports.service';

import { AuthGuard } from 'src/guards/auth.guard';

import { CurrentUser } from 'src/users/decorators/current-user.decorator';

import { User } from 'src/users/user.entity';

import { Serialize } from 'src/interceptors/serialize.interceptor';

import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';

import { AdminGuard } from 'src/guards/admin.guard';

import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {

    constructor(private reportsService: ReportsService) {}

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        console.log(query)
    }   

    @Post()
    @Serialize(ReportDto)
    @UseGuards(AuthGuard)
    createReport(@Body() dto: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(dto, user)
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved)
    }

}
