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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiConsumes,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import type { User } from '../users/entities/user.entity';

@ApiTags('patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Register a new patient' })
  @ApiResponse({ status: 201, description: 'Patient registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or email already registered' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
        documentNumber: { type: 'string' },
        dateOfBirth: { type: 'string', description: 'Required for CI_UY. Format: DD/MM/YYYY' },
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
    @CurrentUser() user: User,
  ) {
    if (!file) {
      throw new BadRequestException('Document photo is required');
    }
    return this.patientsService.create(dto, file.path, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all patients — Admin only' })
  @ApiResponse({ status: 200, description: 'Returns list of all patients' })
  @ApiResponse({ status: 403, description: 'Forbidden — Admin role required' })
  findAll() {
    return this.patientsService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @ApiOperation({ summary: 'Get current patient profile' })
  @ApiResponse({ status: 200, description: 'Returns current patient data' })
  @ApiResponse({ status: 404, description: 'Patient profile not found' })
  findMe(@CurrentUser() user: User) {
    return this.patientsService.findByUserId(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get patient by ID — Admin only' })
  @ApiResponse({ status: 200, description: 'Returns patient data' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Forbidden — Admin role required' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.findById(id);
  }
}