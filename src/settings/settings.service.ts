import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
import { RestaurantDetail } from './restaurant.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepo: Repository<Setting>,
    @InjectRepository(RestaurantDetail)
    private restaurantRepo: Repository<RestaurantDetail>,
  ) {}

  async getSettings() {
    const settings = await this.settingsRepo.find();
    if (!settings.length) {
      return { gstPercentage: 5, discountPercentage: 0 };
    }
    return settings[0];
  }

  async updateSettings(dto: UpdateSettingDto) {
    const settings = await this.settingsRepo.find();
    if (!settings.length) {
      return this.settingsRepo.save(this.settingsRepo.create(dto));
    }
    settings[0].gstPercentage = dto.gstPercentage;
    settings[0].discountPercentage = dto.discountPercentage;
    return this.settingsRepo.save(settings[0]);
  }

  async getRestaurant() {
    const list = await this.restaurantRepo.find();
    if (!list.length) {
      return this.restaurantRepo.save(
        this.restaurantRepo.create({ name: 'RestoBill' }),
      );
    }
    return list[0];
  }

  async updateRestaurant(dto: Partial<RestaurantDetail>) {
    const list = await this.restaurantRepo.find();
    if (!list.length) {
      return this.restaurantRepo.save(this.restaurantRepo.create(dto));
    }
    Object.assign(list[0], dto);
    return this.restaurantRepo.save(list[0]);
  }
}
