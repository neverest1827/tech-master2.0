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

     findBySlugPath(slugPath: string | undefined): Promise<Offer | null> {
        if (!slugPath) throw new NotFoundException('Путь не был передан');

        return this.offerRepository.findOne({
            where: { slug: slugPath },
            relations: ['meta'],
        });
    }
}
