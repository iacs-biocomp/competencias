import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatCompController } from './controllers/cat-comp.controller';
import { CatCompRepo } from './catComp.repository';
import { CatCompService } from './services/cat-comp.service';

@Module({
	imports: [TypeOrmModule.forFeature([CatCompRepo])],
	controllers: [CatCompController],
	providers: [CatCompService],
})
export class CatCompModule {}
