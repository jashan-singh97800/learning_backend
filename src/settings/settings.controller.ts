import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  updateSettings(@Body() dto: UpdateSettingDto) {
    return this.settingsService.updateSettings(dto);
  }

  @Get('restaurant')
  getRestaurant() {
    return this.settingsService.getRestaurant();
  }

  @Put('restaurant')
  updateRestaurant(@Body() dto: any) {
    return this.settingsService.updateRestaurant(dto);
  }
}
