import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatCompController } from './cat-comp.controller';
import { CatCompRepo } from './catComp.repository';

@Module({
	imports: [TypeOrmModule.forFeature([CatCompRepo])],
	controllers: [CatCompController],
})
export class CatCompModule {}
