// /**
// 	 * @deprecated Usar changeRelations
// 	 */
//  private async addRelation(dni: string, relations: ITrabajador[], relType: Reltype): Promise<boolean> {
// 	/** Dates de utilidad en el metodo */
// 	const d8s = {
// 		/** Fecha limite, (now - dias permitidos para no crear nuevos periodos) */
// 		deadline: new Date(new Date().setDate(-30)),
// 		now: new Date(),
// 	};
// 	const trab = await this.trabRepo.findOne(
// 		{ dni: dni },
// 		{
// 			relations: ['periodos', 'periodos.catContr', 'periodos.catComp'],
// 		},
// 	);
// 	const repoRelation = (() => {
// 		switch (relType) {
// 			case 'addinf':
// 				return 'periodos.superiores';
// 			case 'addpar':
// 				return 'periodos.pares';
// 			case 'addsup':
// 				return 'periodos.inferiores';
// 		}
// 	})();
// 	const relKey = (() => {
// 		switch (relType) {
// 			case 'addinf':
// 				return ['inferiores', 'superiores'];
// 			case 'addpar':
// 				return ['pares', 'pares'];
// 			case 'addsup':
// 				return ['superiores', 'inferiores'];
// 		}
// 	})();
// 	if (!trab) {
// 		return false;
// 	}
// 	/** Periodo actual de `trab` */
// 	const actualPeri = trab.periodos.filter(p => p.actual)[0];
// 	if (!actualPeri) {
// 		return false;
// 	}
// 	if (actualPeri.createdAt < d8s.deadline) {
// 		actualPeri.actual = false;
// 		actualPeri.endAt = d8s.now;
// 		await actualPeri.save();
// 		['id', 'endAt', 'createdAt'].forEach(p => delete actualPeri[p]);
// 		actualPeri.actual = true;
// 		delete trab.periodos;
// 		actualPeri.trabajador = trab;
// 		/** Las relaciones (inf/par/sup) del `trab` */
// 		const rels = await Promise.all(
// 			relations.map(r => this.trabRepo.findOne({ dni: r.dni }, { relations: ['periodos', repoRelation] })),
// 		);
// 		actualPeri[relKey[0]] = rels;
// 		await actualPeri.save();
// 		rels.forEach(async rel => {
// 			rel.periodos.filter(p => p.actual)[0][relKey[1]].push(trab);
// 			await rel.periodos[0].save();
// 		});
// 	} else {
// 		const rels = await Promise.all(
// 			relations.map(r => this.trabRepo.findOne({ dni: r.dni }, { relations: ['periodos', repoRelation] })),
// 		);
// 		actualPeri[relKey[0]] = rels;
// 		await actualPeri.save();
// 		await Promise.all(
// 			rels.map(async rel => {
// 				const perActual = rel.periodos.filter(p => p.actual)[0];
// 				perActual[relKey[1]].push(trab);
// 				await perActual.save();
// 			}),
// 		);
// 	}
// 	return true;
// }

// /**
//  *  Elimina las relaciones de un trabajador
//  * @param trab	El trabajador del cual se quieren eliminar esas relaciones
//  * @param relations Las relaciones a eliminar
//  * @param relType El tipo de relación que se va a eliminar
//  * @param recursive `True` si el metodo ha de ejecutarse otra vez para las relaciones del `trab`
//  * @param relationsType El tipo de relaciones como string
//  * @deprecated Usar changeRelations
//  * @returns Una promesa de tipo boolean, `true` si se han eliminado correctamente las relaciones, `false` en caso contrario
//  */
// private async removeRelations(
// 	trab: Trabajador,
// 	relations: Trabajador[],
// 	recursive: boolean,
// 	relationsType: 'inferiores' | 'superiores' | 'pares',
// ): Promise<boolean> {
// 	console.log('hola', trab);
// 	/** Dates de utilidad en el metodo */
// 	const d8s = {
// 		/** Fecha limite, (now - dias permitidos para no crear nuevos periodos) */
// 		deadline: new Date(new Date().setDate(-30)),
// 		now: new Date(),
// 	};
// 	const relTypeReversed = (() => {
// 		switch (relationsType) {
// 			case 'inferiores':
// 				return 'superiores';
// 			case 'pares':
// 				return 'pares';
// 			case 'superiores':
// 				return 'inferiores';
// 		}
// 	})();
// 	/** Periodo actual de `trab` */
// 	const actualPeri = trab.periodos.filter(p => p.actual)[0];
// 	if (!actualPeri) {
// 		return false;
// 	}
// 	if (actualPeri.createdAt < d8s.deadline) {
// 		//Finalizo periodo actual
// 		actualPeri.actual = false;
// 		actualPeri.endAt = d8s.now;
// 		await this.periodRepo.save(actualPeri);
// 		//Actualizo relaciones del trab
// 		['id', 'endAt', 'createdAt'].forEach(p => delete actualPeri[p]);
// 		actualPeri.actual = true;
// 		delete trab.periodos;
// 		actualPeri.trabajador = trab;
// 		// this.concatenateRelations(false, relations, actualPeri, relationsType);
// 		await actualPeri.save();
// 		await Promise.all(
// 			relations.map(rel => {
// 				this.removeRelations(rel, [trab], false, relTypeReversed);
// 			}),
// 		);
// 	} else {
// 		actualPeri.actual = true;
// 		delete trab.periodos;
// 		actualPeri.trabajador = trab;
// 		// this.concatenateRelations(false, relations, actualPeri, relationsType);
// 		await actualPeri.save();
// 		if (!recursive) {
// 			return true;
// 		}
// 		await Promise.all(
// 			relations.map(rel => {
// 				this.removeRelations(rel, [trab], false, relTypeReversed);
// 			}),
// 		);
// 	}
// 	return true;
// }
