<!--  depends on bigan-structure.js -->

							<div class="str-bindable  panel-heading" style="margin: 0 auto;">
									<div class="col-lg-8 col-sm-8">
										<div class="form-group row" data-bind=""> 
										 	<label class="col-sm-6 control-label">Nivel de agregación</label> 
											<div class="col-sm-6 form-inline"> 
		
												<div class="form-check form-check-inline">
												  <input class="form-check-input" type="radio" name="inlineRadioOptions" 
												  		id="levelRadio1" value="global" data-bind="checked: globalDetail">
												  <label class="form-check-label" for="levelRadio1">Global</label>
												</div>
												<div class="form-check form-check-inline">
												  <input class="form-check-input" type="radio" name="inlineRadioOptions" 
												  		id="levelRadio2" value="sector" data-bind="enable: detail2Enabled, checked: globalDetail">
												  <label class="form-check-label" for="levelRadio2">Sector</label>
												</div>
												<div class="form-check form-check-inline">
												  <input class="form-check-input" type="radio" name="inlineRadioOptions" 
												  		id="levelRadio3" value="zbs" data-bind="enable: detail3Enabled, checked: globalDetail">
												  <label class="form-check-label" for="levelRadio3">Zona básica</label>
												</div>
											</div>
										</div>					
									</div> 
							</div>		
	
						
						
				