import {Injectable, NotFoundException} from '@nestjs/common';
import {In, Repository} from "typeorm";
import {Offer} from "./entities/offer.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class OfferService {

    constructor(
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>
    ) {}

     async findBySlugPath(slugPath: string | undefined): Promise<Offer> {
        if (!slugPath) throw new NotFoundException('Путь не был передан');

        const offer: Offer | null = await this.offerRepository.findOne({
            where: { slug: slugPath },
            relations: ['meta'],
        });

        if (!offer) throw new NotFoundException('Услуга не найдена');

        return offer;
    }
}
