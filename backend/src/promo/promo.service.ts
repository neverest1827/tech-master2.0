import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Promo} from "./entities/promo.entity";
import {Repository} from "typeorm";

@Injectable()
export class PromoService {
    constructor(
        @InjectRepository(Promo)
        private readonly promoRepository: Repository<Promo>,
    ) {}

    async findAll(): Promise<Promo[]> {
        return await this.promoRepository.find();
    }
}
