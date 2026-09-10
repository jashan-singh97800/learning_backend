import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuRepo: Repository<MenuItem>,
  ) {}

  async findAll(category?: string) {
    const query = this.menuRepo.createQueryBuilder('menu');
    if (category) {
      query.where('menu.category = :category', { category });
    }
    return query.orderBy('menu.category', 'ASC').addOrderBy('menu.name', 'ASC').getMany();
  }

  async findOne(id: string) {
    const item = await this.menuRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async create(dto: CreateMenuDto) {
    const item = this.menuRepo.create(dto);
    return this.menuRepo.save(item);
  }

  async update(id: string, dto: Partial<CreateMenuDto>) {
    await this.findOne(id);
    await this.menuRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.menuRepo.delete(id);
    return { message: 'Menu item deleted successfully' };
  }

  async getCategories() {
    const result = await this.menuRepo
      .createQueryBuilder('menu')
      .select('DISTINCT menu.category', 'category')
      .orderBy('menu.category', 'ASC')
      .getRawMany();
    return result.map((r) => r.category);
  }
}
