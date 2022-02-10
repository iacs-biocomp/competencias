import { Injectable } from '@nestjs/common';
import { EvModelRepo } from '../modelos.repository';
import { SubModelRepo } from '../subModel.repository';

@Injectable()
export class ModelosService {
	constructor(private readonly evModelRepo: EvModelRepo, private readonly subModelRepo: SubModelRepo) {}
	// TODO: Add crud
}
