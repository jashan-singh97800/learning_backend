import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  private generateOrderNumber(): string {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timePart = now.getTime().toString().slice(-5);
    return `ORD-${datePart}-${timePart}`;
  }

  async create(dto: CreateOrderDto, staffId?: string) {
    let order: Order;

    if (dto.id) {
      // 1. Delete all existing items first
      await this.orderItemRepo.delete({ orderId: dto.id });
      
      // 2. Fetch the order without items to get a clean slate
      const existingOrder = await this.orderRepo.findOne({ where: { id: dto.id } });
      if (!existingOrder) throw new NotFoundException('Order not found');
      
      order = existingOrder;
      order.customerName = dto.customerName;
      order.customerPhone = dto.customerPhone || '';
      order.subtotal = dto.subtotal;
      order.tax = dto.tax || 0;
      order.total = dto.total;
      order.discount = dto.discount || 0;
      order.notes = dto.notes || '';
      order.status = dto.status || 'completed';
    } else {
      order = this.orderRepo.create({
        orderNumber: this.generateOrderNumber(),
        customerName: dto.customerName,
        customerPhone: dto.customerPhone || '',
        staffId,
        subtotal: dto.subtotal,
        tax: dto.tax || 0,
        total: dto.total,
        discount: dto.discount || 0,
        notes: dto.notes || '',
        status: dto.status || 'completed',
      });
    }

    // Map and assign new items
    order.items = dto.items.map((item) =>
      this.orderItemRepo.create({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount || 0,
        total: item.total,
      }),
    );

    const saved = await this.orderRepo.save(order);
    // Returning with fresh state
    return this.findOne(saved.id);
  }

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.orderRepo.findAndCount({
      relations: ['items', 'staff'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findAllHoldBills() {
    return this.orderRepo.find({
      where: { status: 'hold' },
      relations: ['items', 'staff'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'staff'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getSalesReport(filter: 'daily' | 'weekly' | 'monthly' | 'yearly', search?: string) {
    const now = new Date();
    let startDate: Date;

    switch (filter) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const day = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - day);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const query = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.staff', 'staff')
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.status = :status', { status: 'completed' });

    if (search) {
      query.andWhere(
        '(LOWER(order.customerName) LIKE :search OR order.customerPhone LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    query.orderBy('order.createdAt', 'DESC');

    const orders = await query.getMany();

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      orders,
      summary: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        filter,
        startDate,
        endDate: now,
      },
    };
  }

  async softDelete(id: string) {
    // Fetch without the `items` relation: Order.items has cascade: true, and
    // TypeORM's softRemove cascades into any loaded relation with cascade
    // enabled — but OrderItem has no @DeleteDateColumn, so cascading into it
    // throws. Order items stay untouched; they're only ever queried through
    // their (now soft-deleted) parent order.
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return this.orderRepo.softRemove(order);
  }
}
