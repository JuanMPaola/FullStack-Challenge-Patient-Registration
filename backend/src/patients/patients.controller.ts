import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['fullName', 'email', 'countryCode', 'phoneNumber', 'documentType', 'documentPhoto'],
      properties: {
        fullName: { type: 'string' },
        email: { type: 'string' },
        countryCode: { type: 'string' },
        phoneNumber: { type: 'string' },
        documentType: { type: 'string', enum: ['DNI_AR', 'CI_UY'] },
        documentPhoto: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('documentPhoto', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (extname(file.originalname).toLowerCase() !== '.jpg') {
          return cb(new Error('Only .jpg files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() dto: CreatePatientDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Document photo is required');
    }
    return this.patientsService.create(dto, file.path);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.findById(id);
  }
}