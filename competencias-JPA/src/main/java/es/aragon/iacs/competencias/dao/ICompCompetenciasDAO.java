package es.aragon.iacs.competencias.dao;

import java.util.List;
import java.util.Date;
import es.aragon.iacs.competencias.jpa.CompCompetencias;
import es.aragon.iacs.competencias.jpa.CompObjetivosCompCatcomp;
import es.aragon.iacs.competencias.jpa.CompRelCompCompleto;

public interface ICompCompetenciasDAO {

	List<CompCompetencias> findAll();
	List<CompCompetencias> findActivas();

	void delete(String codigo);

	void insert(String codigo, String descripcion, Date alta, Date baja);

	void edit(String codigo, String descripcion, Date alta, Date baja);

	List<CompObjetivosCompCatcomp> compPorCatComp(String codCatCompetencial);

	List<CompRelCompCompleto> relacionesPorCatComp(String codCatCompetencial);

	boolean deleteRelacion(Integer idRelacion);
	void insertRelacion(String codCompetencia, String codCatComp, Integer idNivel);
	void insertRelacionComportamientos(String codCompetencia, String codCatComp, Integer idNivel, Integer idComportamiento);
	void deleteRelacionComportamientos(String catCompetencial, String codCompetencia);
	void deleteRelacionComportamientos(Integer idRelacion);
	List<CompObjetivosCompCatcomp> allObjCompCatcomp();
	void editRelacion(Integer idRelacion, Integer objetivo);
	List<CompCompetencias> findByCodigo(String codigo);

}