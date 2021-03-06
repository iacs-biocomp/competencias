package es.aragon.iacs.competencias.jpa;

import java.io.Serializable;
import javax.persistence.*;

@Entity
@Table(name="comp_evaluador_interno")
@NamedQueries({
	@NamedQuery(name="CompEvaluadorInterno.findAll", query="SELECT c FROM CompEvaluadorInterno c ORDER BY c.idrelacion"),
	@NamedQuery(name="CompEvaluadorInterno.findByEvaluacion", query="SELECT c FROM CompEvaluadorInterno c WHERE c.idevaluacion=:idevaluacion"),
	@NamedQuery(name="CompEvaluadorInterno.findByEvaluador", query="SELECT c FROM CompEvaluadorInterno c WHERE c.dnievaluador=:dnievaluador ORDER BY c.idrelacion"),
	@NamedQuery(name="CompEvaluadorInterno.findByDniTrabajador", query="SELECT c FROM CompEvaluadorInterno c WHERE c.dnitrabajador=:dnitrabajador ORDER BY c.idrelacion"),
	@NamedQuery(name="CompEvaluadorInterno.findById", query="SELECT c FROM CompEvaluadorInterno c WHERE c.idrelacion=:idrelacion"),
	@NamedQuery(name="CompEvaluadorInterno.findRelacion", query="SELECT c FROM CompEvaluadorInterno c WHERE c.idevaluacion=:idevaluacion AND c.dnievaluador=:dnievaluador AND c.dnitrabajador=:dnitrabajador"),
	@NamedQuery(name="CompEvaluadorInterno.findInternos", query="SELECT c FROM CompEvaluadorInterno c WHERE c.dnitrabajador=:dnitrabajador AND grupo=:grupo AND idevaluacion=:idevaluacion ORDER BY c.idrelacion")
})
public class CompEvaluadorInterno implements Serializable{
	
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name="comp_evaluador_interno_id_seq", sequenceName="comp_evaluador_interno_id_seq", allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator="comp_evaluador_interno_id_seq")
	private Integer idrelacion;
	private String dnitrabajador;
	private String dnievaluador;
	private Integer idevaluacion;
	private Integer grupo;
	private String comp1;
	private String comp2;
	private String comp3;
	private String comp4;
	private String comp5;
	private String comp6;
	private String comp7;
	private String comp8;
	private String comp9;
	private String comp10;
	private String justificacion;
	private Boolean validado;

	public Integer getIdrelacion() {
		return idrelacion;
	}
	public void setIdrelacion(Integer idrelacion) {
		this.idrelacion = idrelacion;
	}
	
	public String getDnitrabajador() {
		return dnitrabajador;
	}
	public void setDnitrabajador(String dnitrabajador) {
		this.dnitrabajador = dnitrabajador;
	}
	public String getDnievaluador() {
		return dnievaluador;
	}
	public void setDnievaluador(String dnievaluador) {
		this.dnievaluador = dnievaluador;
	}
	public Integer getIdevaluacion() {
		return idevaluacion;
	}
	public void setIdevaluacion(Integer idevaluacion) {
		this.idevaluacion = idevaluacion;
	}
	public Integer getGrupo() {
		return grupo;
	}
	public void setGrupo(Integer grupo) {
		this.grupo = grupo;
	}
	public String getComp1() {
		return comp1;
	}
	public void setComp1(String comp1) {
		this.comp1 = comp1;
	}
	public String getComp2() {
		return comp2;
	}
	public void setComp2(String comp2) {
		this.comp2 = comp2;
	}
	public String getComp3() {
		return comp3;
	}
	public void setComp3(String comp3) {
		this.comp3 = comp3;
	}
	public String getComp4() {
		return comp4;
	}
	public void setComp4(String comp4) {
		this.comp4 = comp4;
	}
	public String getComp5() {
		return comp5;
	}
	public void setComp5(String comp5) {
		this.comp5 = comp5;
	}
	public String getComp6() {
		return comp6;
	}
	public void setComp6(String comp6) {
		this.comp6 = comp6;
	}
	public String getComp7() {
		return comp7;
	}
	public void setComp7(String comp7) {
		this.comp7 = comp7;
	}
	public String getComp8() {
		return comp8;
	}
	public void setComp8(String comp8) {
		this.comp8 = comp8;
	}
	public String getComp9() {
		return comp9;
	}
	public void setComp9(String comp9) {
		this.comp9 = comp9;
	}
	public String getComp10() {
		return comp10;
	}
	public void setComp10(String comp10) {
		this.comp10 = comp10;
	}
	public String getJustificacion() {
		return justificacion;
	}
	public void setJustificacion(String justificacion) {
		this.justificacion = justificacion;
	}
	public Boolean getValidado() {
		return validado;
	}
	public void setValidado(Boolean validado) {
		this.validado = validado;
	}
}

