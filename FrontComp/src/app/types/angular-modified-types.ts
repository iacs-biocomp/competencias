import { Route } from '@angular/router';
import { Roles } from 'sharedInterfaces/Entity';

/**
 * Usar este tipo de rutas y no las que tiene por defecto angular ya que aqui son extendidas
 * y tipadas las propiedades adicionales
 */
export type CompRoutes = CompRoute[];
export type CompRoute = {
	data?: {
		roles?: Roles[];
	};
} & Route;
