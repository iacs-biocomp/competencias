/**
 * TODO: HECHO
 * @param target el objeto al que se la añade la propiedad
 * @param propertyKey la propiedad requerida para añadirle al objeto
 */
export function Required(target: object, propertyKey: string) {
	Object.defineProperty(target, propertyKey, {
		get() {
			throw new Error(`Attribute ${propertyKey} is required`);
		},
		set(value) {
			Object.defineProperty(target, propertyKey, {
				value,
				writable: true,
				configurable: true,
			});
		},
	});
}
