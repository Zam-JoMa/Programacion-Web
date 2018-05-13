$(document).ready(function(){
	//El DOM esta cargado"
	cargarComboCentro();
	cargarComboCarrera();
	cargarCancelarAsignaturas();
	cargarAsignaturasEspera();
	cargarCancelarAsignaturasEspera();
	cargarCancelarLaboratorio();
	cargarHistorialAcademico();
	cargarForma03();
	cargarCalificaciones();
	cargarCambioCarrera();
	cargarCambioCentro();
	cargarDatosAdicionarAsignatura();
	cargarDatosAdicionarLaboratorio();
	cargarCargaAcademicaDocente();
	cargarSubirNotas();
	cargarSeccionesMatricula();
	cargarSeccionesLaboratorio();
	
});

function campoCorrecto(etiqueta){
	document.getElementById(etiqueta).classList.remove("is-invalid");
	document.getElementById(etiqueta).classList.add("is-valid");
}

function campoIncorrecto(etiqueta){
	document.getElementById(etiqueta).classList.remove("is-valid");
	document.getElementById(etiqueta).classList.add("is-invalid");
}

function cargarComboCentro(){
	console.log("Se cargara el combo box de cambio de centro");
	var parametros = "centroActual="+$("#centroActualAlumno").val();
	console.log(parametros);
	$.ajax({
			url:"/cambioCentro",
			data:parametros,
			type:"POST",
			success:function(respuesta){
				console.log(respuesta);
				for (var i = 0; i<respuesta.length; i++){
				var contenido = "";
				contenido += "<option>"+respuesta[i].nombre_campus+"</option>";	
				$("#cboCentro").append(contenido);
				}
				

			}


	});
}

function cargarComboCarrera(){
	console.log("Se cargara el combo box de escoger carrera");
	var parametros = "carreraActual="+$("#carreraActualAlumno").val();
	console.log(parametros);
	$.ajax({
		url:"/cambiarCarrera",
		data:parametros,
		type:"POST",
		success:function(respuesta){
			console.log(respuesta);
				for (var i = 0; i<respuesta.length; i++){
				var contenido = "";
				contenido += "<option>"+respuesta[i].nombre_carrera+"</option>";	
				$("#cboCarrera").append(contenido);
				}
		}

	});
}

function cambiarCarrera(){
		console.log("Se enviara la info");
		var parametros = 
		"cboCarrera="+$("#cboCarrera").val()+"&"+
		"motivoCambioCarrera= "+$("#motivoCambioCarrera").val();
		console.log(parametros);
		$.ajax({
			url:"/guardarNuevoCarrera",
			method:"POST",
			data:parametros,
			dataType:"json",
			success:function(respuesta){
				console.log(respuesta);
			}
	});

}

function cambiarCentro(){
	console.log("Se enviara la info");
	var parametros =
	"cboCentro="+$("#cboCentro").val()+"&"+
	"motivoCambioCentro="+$("#motivoCambioCentro").val();
	console.log(parametros);
	$.ajax({
		url:"/guardarNuevoCentro",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
			console.log(respuesta);
		}
	});
}

function cambiarCorreo(){
	console.log("Se enviara la info");
	var parametros = "correoNuevo= "+($("#txtcorreoNuevo").val()).toLowerCase();
	console.log(parametros);
	var patron = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(patron.test(String($("#txtcorreoNuevo").val()).toLowerCase())){
		$.ajax({
		url:"/guardarNuevoCorreo",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
			console.log(respuesta);
			campoCorrecto("txtcorreoNuevo");
			$("#txtcorreoNuevo").val("");
		}
	});
	}else {
		campoIncorrecto("txtcorreoNuevo");
		$("#txtcorreoNuevo").val("");
	}
	
}

function cambiarContrasenia(){
	console.log("Se enviara la info");
	var parametros = "txtpassNew="+$("#txtpassNew").val();
	console.log(parametros);
	var patron = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
	if (patron.test($("#txtpassNew").val())){
		$.ajax({
		url:"/guardarNuevoContrasenia",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
			console.log(respuesta);
			campoCorrecto("txtpassNew");
			$("#txtpassNew").val("");
		}
	});
	}else{
		campoIncorrecto("txtpassNew");
		$("#txtpassNew").val("");
	}
	
}

function cargarCancelarAsignaturas(){
	console.log("Se cargaran las clases para cancelar");
	$.ajax({
			url:"/cancelarClases",
			success:function(respuesta){
				console.log(respuesta);
					for (var i = 0; i<respuesta.length; i++){
						var contenido = "";
						contenido += '<tr><td><input value="'+respuesta[i].matricula_id+'" type="radio" name="chkClaseCancelar"></td>'+
						                '<td>'+respuesta[i].codigo_asignatura+'</td>'+
						                '<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
						                '<td>'+respuesta[i].nombre_asignatura+'</td>'+
						                '<td>'+respuesta[i].nombre_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_fin_seccion+'</td>'+
						                '<td>'+respuesta[i].dias_seccion+'</td>'+
						                '<td>'+respuesta[i].nombre_edificio+'</td>'+
						                '<td>'+respuesta[i].nombre_aula+'</td></tr>';
						$("#contenidoClasesCancelar").append(contenido);
					}
				}
			
	});
}
 
 function cargarAsignaturasEspera(){
 	console.log("Se cargaran las clases en lista de espera");
 	$.ajax({
 		url:"/asignaturasEspera",
 		success:function(respuesta){
 			console.log(respuesta);
 			for (var i = 0; i<respuesta.length; i++){
						var contenido = "";
						contenido += '<tr><td>'+respuesta[i].codigo_asignatura+'</td>'+
						                '<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
						                '<td>'+respuesta[i].nombre_asignatura+'</td>'+
						                '<td>'+respuesta[i].nombre_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_fin_seccion+'</td>'+
						                '<td>'+respuesta[i].dias_seccion+'</td>'+
						                '<td>'+respuesta[i].nombre_edificio+'</td>'+
						                '<td>'+respuesta[i].nombre_aula+'</td></tr>';
						$("#contenidoAsignaturasEspera").append(contenido);
					}
 		}
 	});
 }

 function cargarCancelarAsignaturasEspera(){
 	console.log("Se cargaran las clases en lista de espera");
 	$.ajax({
 		url:"/asignaturasEspera",
 		success:function(respuesta){
 			console.log(respuesta);
 			for (var i = 0; i<respuesta.length; i++){
						var contenido = "";
						contenido += '<tr><td><input type="radio" value="'+respuesta[i].matricula_id+'" name="chkClaseEsperaCancelar"></td>'+
						                '<td>'+respuesta[i].codigo_asignatura+'</td>'+
						                '<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
						                '<td>'+respuesta[i].nombre_asignatura+'</td>'+
						                '<td>'+respuesta[i].nombre_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_fin_seccion+'</td>'+
						                '<td>'+respuesta[i].dias_seccion+'</td>'+
						                '<td>'+respuesta[i].nombre_edificio+'</td>'+
						                '<td>'+respuesta[i].nombre_aula+'</td></tr>';
						$("#contenidoAsignaturasEsperaCancelar").append(contenido);
					}
 		}
 	});
 }

 function cargarHistorialAcademico(){
 	console.log("Se cargar el historial academico");
 	$.ajax({
 		url:"/cargarHistorialAcademico",
 		success:function(respuesta){
 			console.log(respuesta);
 			$("#datosHistorial").html('<tr>'+
 										'<td align="left"><span class="negritasHistorial">Numero de Cuenta:</span> '+respuesta[0].cuenta_alumno+'</td>'+
 										'<td align="right"><span class="negritasHistorial">Centro:</span> '+respuesta[0].nombre_campus+'</td>'+
 										'</tr>'+
 										'<tr>'+
 										' <td align="left"><span class="negritasHistorial">Nombre:</span> '+respuesta[0].primer_nombre_persona+' '+respuesta[0].segundo_nombre_persona+' '+respuesta[0].primer_apellido_persona+' '+respuesta[0].segundo_apellido_persona+'</td>'+
 										'<td align="right"><span class="negritasHistorial">Indice :</span> '+respuesta[0].promedio_alumno+'%</td>'+
 										'</tr>'+
 										'<tr>'+
 										'<td align="left"><span class="negritasHistorial">Carrera:</span> '+respuesta[0].nombre_carrera+'</td>'+
 										'<td align="right"><span class="negritasHistorial"></td>'+
 										'</tr>'+
 										'<tr>'+
 										'<td align="left"></td>'+
 										'<td align="right"></td>'+
 										'</tr>');
 			$("#fotoHistorial").attr("src", respuesta[0].foto);
 		}
 	});
 	cargarDatosHistorial();

 }

 function cargarDatosHistorial(){
 	$.ajax({
 	url:"/cargarDatosHistorialAcademico",
 	success:function(respuesta){
 		console.log(respuesta);
 		for (var i = 0; i<respuesta.length; i++){
 			$("#clasesHistorial").append('<tr>'+
 						'<td>'+respuesta[i].codigo_asignatura+'</td>'+
 						'<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
 						'<td>'+respuesta[i].nombre_asignatura+'</td>'+
 						'<td>'+respuesta[i].nombre_seccion+'</td>'+
 						'<td colspan="2">'+respuesta[i].nombre_periodo+'</td>'+
 						'<td>'+respuesta[i].promedio+'</td>'+
 						'<td>'+respuesta[i].observacion+'</td>'+
 						'</tr>');
 						

 		}
 		
 	}
 	});
 }

function cargarForma03(){
	$.ajax({
		url:"/obtenerDatosForma03",
		success:function(respuesta){
			console.log(respuesta);
			$("#infoForma03").html('<tr>'+
									'<td align="left"><span class="negritasHistorial">Numero de Cuenta:</span> '+respuesta[0].cuenta_alumno+'</td>'+
									'<td align="right"><span class="negritasHistorial">Centro:</span> '+respuesta[0].nombre_campus+'</td>'+
									'</tr>'+
									'<tr>'+
									'<td align="left"><span class="negritasHistorial">Nombre:</span> '+respuesta[0].primer_nombre_persona+' '+respuesta[0].segundo_nombre_persona+' '+respuesta[0].primer_apellido_persona+' '+respuesta[0].segundo_apellido_persona+'</td>'+
									' <td align="right"><span class="negritasHistorial">Periodo:</span> '+respuesta[0].nombre_periodo+'</td>'+
									' </tr>'+
									'<tr>'+
									'<td align="left" colspan="2"><span class="negritasHistorial">Carrera:</span> '+respuesta[0].nombre_carrera+'</td>'+
									'</tr>'+
									' <tr>'+
									' <td align="left"></td>'+
									'<td align="right"></td>'+
									'</tr>');
			$("#fotoForma03").attr("src", respuesta[0].foto);
		}
	});
	cargarClasesForma03();
}

function cargarClasesForma03 (){
	$.ajax({
		url:"/obtenerClasesForma03",
		success:function(respuesta){
			console.log(respuesta);
			for (var i = 0; i<respuesta.length; i++){
				$("#clasesForma03").append('<tr>'+
											'<td>'+respuesta[i].codigo_asignatura+'</td>'+
											'<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
											'<td>'+respuesta[i].nombre_asignatura+'</td>'+
											'<td>'+respuesta[i].nombre_seccion+'</td>'+
											'<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
											'<td>'+respuesta[i].hora_fin_seccion+'</td>'+
											'<td>'+respuesta[i].dias_seccion+'</td>'+
											'<td>'+respuesta[i].nombre_edificio+'</td>'+
											'<td>'+respuesta[i].nombre_aula+'</td>'+
											'</tr>');
			}
		}
	});
	cargarLaboratoriosForma03();
}

function cargarLaboratoriosForma03 (){
	$.ajax({
		url:"/obtenerLaboratoriosForma03",
		success: function(respuesta){
			console.log(respuesta);
			for (var i = 0; i<respuesta.length; i++){
				$("#laboratoriosForma03").append('<tr>'+
												'<td>'+respuesta[i].codigo_asignatura+'</td>'+
												'<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
												'<td>'+respuesta[i].nombre_asignatura+'</td>'+
												'<td>'+respuesta[i].nombre_seccion_lab+'</td>'+
												'<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
												'<td>'+respuesta[i].hora_fin_seccion+'</td>'+
												'<td>'+respuesta[i].dias_seccion+'</td>'+
												'<td>'+respuesta[i].nombre_edificio+'</td>'+
												'<td>'+respuesta[i].nombre_aula+'</td>'+
												'</tr>');
			}
		}
	});
}

function cargarCancelarLaboratorio(){
	$.ajax({
		url:"/obtenerLaboratoriosForma03",
		success: function(respuesta){
			console.log(respuesta);
			for (var i = 0; i<respuesta.length; i++){
				$("#labCancelar").append('<tr>'+
												'<td><input value="'+respuesta[i].matricula_lab_id+'" name="chkLabCancelar" type="radio"></td>'+
												'<td>'+respuesta[i].codigo_asignatura+'</td>'+
												'<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
												'<td>'+respuesta[i].nombre_asignatura+'</td>'+
												'<td>'+respuesta[i].nombre_seccion_lab+'</td>'+
												'<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
												'<td>'+respuesta[i].hora_fin_seccion+'</td>'+
												'<td>'+respuesta[i].dias_seccion+'</td>'+
												'<td>'+respuesta[i].nombre_edificio+'</td>'+
												'<td>'+respuesta[i].nombre_aula+'</td>'+
												'</tr>');
			}
		}
	});
}

function cargarCalificaciones(){
	$.ajax({
		url:"/cargarDatosCalificaciones",
		success:function(respuesta){
			console.log(respuesta);
			$("#datosCalificaciones").html('<tr>'+
									'<td align="left"><span class="negritasHistorial">Numero de Cuenta:</span> '+respuesta[0].cuenta_alumno+'</td>'+
									'<td align="right"><span class="negritasHistorial">Centro:</span> '+respuesta[0].nombre_campus+'</td>'+
									'</tr>'+
									'<tr>'+
									'<td align="left"><span class="negritasHistorial">Nombre:</span> '+respuesta[0].primer_nombre_persona+' '+respuesta[0].segundo_nombre_persona+' '+respuesta[0].primer_apellido_persona+' '+respuesta[0].segundo_apellido_persona+'</td>'+
									' <td align="right"><span class="negritasHistorial">Periodo:</span> '+respuesta[0].nombre_periodo+'</td>'+
									' </tr>'+
									'<tr>'+
									'<td align="left" colspan="2"><span class="negritasHistorial">Carrera:</span> '+respuesta[0].nombre_carrera+'</td>'+
									'</tr>'+
									'<tr>'+
									'<td align="left"></td>'+
									'<td align="right"></td>'+
									'</tr>');
			$("#fotoCalificaciones").attr("src", respuesta[0].foto);
		}
	});
	cargarNotasCalificaciones();
}

function cargarNotasCalificaciones(){
	$.ajax({
		url:"/cargarNotasCalificaciones",
		success:function(respuesta){
			console.log(respuesta);
			for (var i = 0; i<respuesta.length; i++){
 			$("#notasAsignaturas").append('<tr>'+
 						'<td>'+respuesta[i].codigo_asignatura+'</td>'+
 						'<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
 						'<td>'+respuesta[i].nombre_asignatura+'</td>'+
 						'<td>'+respuesta[i].nombre_seccion+'</td>'+
 						'<td colspan="2">'+respuesta[i].nombre_periodo+'</td>'+
 						'<td>'+respuesta[i].promedio+'</td>'+
 						'<td>'+respuesta[i].observacion+'</td>'+
 						'</tr>');
 						

 		}
		}
	});
}

function cargarCambioCarrera(){
	$.ajax({
		url:"/cargarDatosCambios",
		success:function(respuesta){
			$("#infoCambioCarrera").html('<tr>'+
											'<td align="left"><span class="negritasHistorial">Nombre:</span> '+respuesta[0].primer_nombre_persona+' '+respuesta[0].segundo_nombre_persona+' '+respuesta[0].primer_apellido_persona+' '+respuesta[0].segundo_apellido_persona+'</td>'+
											'<td align="right"><span class="negritasHistorial">Numero de Cuenta:</span> '+respuesta[0].cuenta_alumno+'</td>'+
											'</tr>'+
											'<tr>'+
											' <td align="left"><span class="negritasHistorial">Centro:</span> '+respuesta[0].nombre_campus+'</td>'+
											'<td align="right"><span class="negritasHistorial">Carrera:</span> '+respuesta[0].nombre_carrera+'</td>'+
											'</tr>'+
											'<tr>'+
											'<td align="left"></td>'+
											'<td align="right"></td>'+
											'</tr>');
			$("#fotoCambioCarrera").attr("src", respuesta[0].foto);
			$("#carreraActualAlumno").val(respuesta[0].carrera_id);
		}
	});
	
}

function cargarCambioCentro(){
	$.ajax({
		url:"/cargarDatosCambios",
		success:function(respuesta){
			$("#infoCambioCentro").html('<tr>'+
											'<td align="left"><span class="negritasHistorial">Nombre:</span> '+respuesta[0].primer_nombre_persona+' '+respuesta[0].segundo_nombre_persona+' '+respuesta[0].primer_apellido_persona+' '+respuesta[0].segundo_apellido_persona+'</td>'+
											'<td align="right"><span class="negritasHistorial">Numero de Cuenta:</span> '+respuesta[0].cuenta_alumno+'</td>'+
											'</tr>'+
											'<tr>'+
											' <td align="left"><span class="negritasHistorial">Centro:</span> '+respuesta[0].nombre_campus+'</td>'+
											'<td align="right"><span class="negritasHistorial">Carrera:</span> '+respuesta[0].nombre_carrera+'</td>'+
											'</tr>'+
											'<tr>'+
											'<td align="left"></td>'+
											'<td align="right"></td>'+
											'</tr>');
			$("#fotoCambioCentro").attr("src", respuesta[0].foto);
			$("#centroActualAlumno").val(respuesta[0].campus_id);
		}
	});
}

function cargarDatosAdicionarAsignatura(){
	$.ajax({
		url:"/obtenerDatosForma03",
		success: function(respuesta){
			$("#infoAdicionarMatricula").html('<tr>'+
												' <td align="left"><span class="negritasHistorial">Numero de Cuenta:</span> '+respuesta[0].cuenta_alumno+'</td>'+
												'<td align="right"><span class="negritasHistorial">Centro:</span> '+respuesta[0].nombre_campus+'</td>'+
												'</tr>'+
												'<tr>'+
												'<td align="left"><span class="negritasHistorial">Nombre:</span> '+respuesta[0].primer_nombre_persona+' '+respuesta[0].segundo_nombre_persona+' '+respuesta[0].primer_apellido_persona+' '+respuesta[0].segundo_apellido_persona+'</td>'+
												'<td align="right"><span class="negritasHistorial">Año:</span> '+respuesta[0].nombre_periodo+'</td>'+
												'</tr>'+
												'<tr>'+
												'<td align="left"><span class="negritasHistorial">Carrera:</span> '+respuesta[0].nombre_carrera+'</td>'+
												'<td align="right"><button type="button" class="btn btn-secondary btn-sm" data-toggle="modal" data-target="#modalAdicionarAsignatura">Adicionar Asignatura</button></td>'+
												'</tr>'+
												'<tr>'+
												'<td align="left"></td>'+
												'<td align="right"></td>'+
												'</tr>');
			$("#fotoAdicionarAsignatura").attr("src", respuesta[0].foto);
		}
	});
	cargarAsignaturasMatriculadas();

}

function cargarAsignaturasMatriculadas (){
	$.ajax({
		url:"/obtenerClasesForma03",
		success:function(respuesta){
			console.log(respuesta);
			for (var i = 0; i<respuesta.length; i++){
				$("#cargarAsignaturasAdicionadas").append('<tr>'+
											'<td>'+respuesta[i].codigo_asignatura+'</td>'+
											'<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
											'<td>'+respuesta[i].nombre_asignatura+'</td>'+
											'<td>'+respuesta[i].nombre_seccion+'</td>'+
											'<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
											'<td>'+respuesta[i].hora_fin_seccion+'</td>'+
											'<td>'+respuesta[i].dias_seccion+'</td>'+
											'<td>'+respuesta[i].nombre_edificio+'</td>'+
											'<td>'+respuesta[i].nombre_aula+'</td>'+
											'</tr>');
			}
		}
	});
cargarAsignaturasEnEspera();
}

 function cargarAsignaturasEnEspera(){
 	console.log("Se cargaran las clases en lista de espera");
 	$.ajax({
 		url:"/asignaturasEspera",
 		success:function(respuesta){
 			console.log(respuesta);
 			for (var i = 0; i<respuesta.length; i++){
						var contenido = "";
						contenido += '<tr><td>'+respuesta[i].codigo_asignatura+'</td>'+
						                '<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
						                '<td>'+respuesta[i].nombre_asignatura+'</td>'+
						                '<td>'+respuesta[i].nombre_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_fin_seccion+'</td>'+
						                '<td>'+respuesta[i].dias_seccion+'</td>'+
						                '<td>'+respuesta[i].nombre_edificio+'</td>'+
						                '<td>'+respuesta[i].nombre_aula+'</td></tr>';
						$("#cargarAsignaturasEnEspera").append(contenido);
					}
 		}
 	});
 }

function cargarDatosAdicionarLaboratorio(){
	$.ajax({
		url:"/obtenerDatosForma03",
		success: function(respuesta){
			$("#infoAdicionarLaboratorio").html('<tr>'+
												' <td align="left"><span class="negritasHistorial">Numero de Cuenta:</span> '+respuesta[0].cuenta_alumno+'</td>'+
												'<td align="right"><span class="negritasHistorial">Centro:</span> '+respuesta[0].nombre_campus+'</td>'+
												'</tr>'+
												'<tr>'+
												'<td align="left"><span class="negritasHistorial">Nombre:</span> '+respuesta[0].primer_nombre_persona+' '+respuesta[0].segundo_nombre_persona+' '+respuesta[0].primer_apellido_persona+' '+respuesta[0].segundo_apellido_persona+'</td>'+
												'<td align="right"><span class="negritasHistorial">Año:</span> '+respuesta[0].nombre_periodo+'</td>'+
												'</tr>'+
												'<tr>'+
												'<td align="left"><span class="negritasHistorial">Carrera:</span> '+respuesta[0].nombre_carrera+'</td>'+
												'<td align="right"><button type="button" class="btn btn-secondary btn-sm" data-toggle="modal" data-target="#modalAdicionarLaboratorio">Adicionar Laboratorio</button></td>'+
												'</tr>'+
												'<tr>'+
												'<td align="left"></td>'+
												'<td align="right"></td>'+
												'</tr>');
			$("#fotoAdicionarLaboratorio").attr("src", respuesta[0].foto);
		}
	});
cargarLaboratoriosMatriculados();

}

function cargarLaboratoriosMatriculados(){
	$.ajax({
		url:"/obtenerLaboratoriosForma03",
		success: function(respuesta){
			console.log(respuesta);
			for (var i = 0; i<respuesta.length; i++){
				$("#datosLaboratoriosMatriculados").append('<tr>'+
												'<td>'+respuesta[i].codigo_asignatura+'</td>'+
												'<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
												'<td>'+respuesta[i].nombre_asignatura+'</td>'+
												'<td>'+respuesta[i].nombre_seccion_lab+'</td>'+
												'<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
												'<td>'+respuesta[i].hora_fin_seccion+'</td>'+
												'<td>'+respuesta[i].dias_seccion+'</td>'+
												'<td>'+respuesta[i].nombre_edificio+'</td>'+
												'<td>'+respuesta[i].nombre_aula+'</td>'+
												'</tr>');
			}
		}
	});
}

function cargarCargaAcademicaDocente(){
	$.ajax({
		url:"/obtenerInfoDocente",
		success: function(respuesta){
			console.log(respuesta);
			$("#datosDocenteCarga").html('<tr>'+
											'<td align="left"><span class="negritasHistorial">Numero de Empleado:</span> '+respuesta[0].numero_empleado+'</td>'+
											'<td align="right"><span class="negritasHistorial">Centro:</span> '+respuesta[0].nombre_campus+'</td>'+
											'</tr>'+
											'<tr>'+
											'<td align="left"><span class="negritasHistorial">Nombre:</span> '+respuesta[0].primer_nombre_persona+' '+respuesta[0].segundo_nombre_persona+' '+respuesta[0].primer_apellido_persona+' '+respuesta[0].segundo_apellido_persona+'</td>'+
											'<td align="right"><span class="negritasHistorial">Departamento:</span> '+respuesta[0].nombre_carrera+'</td>'+
											'</tr>'+
											'<tr>'+
											'<td align="left"></td>'+
											'<td align="right"></td>'+
											'</tr>');
			$("#fotoCargaAcademica").attr("src", respuesta[0].foto);
		}
	});
	cargarClasesDocente();
}


function cargarClasesDocente(){
	$.ajax({
		url:"/obtenerCargaAcademica",
		success: function(respuesta){
			console.log(respuesta);
			for (var i = 0; i<respuesta.length; i++){
				$("#cargaAcademicaDocente").append('<tr>'+
											'<td>'+respuesta[i].codigo_asignatura+'</td>'+
											'<td>'+respuesta[i].nombre_asignatura+'</td>'+
											'<td>'+respuesta[i].nombre_seccion+'</td>'+
											'<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
											'<td>'+respuesta[i].hora_fin_seccion+'</td>'+
											'<td>'+respuesta[i].dias_seccion+'</td>'+
											'<td>'+respuesta[i].nombre_edificio+'</td>'+
											'<td>'+respuesta[i].nombre_aula+'</td>'+
											'</tr>');
			}
		}
	});
}

function cargarSubirNotas(){
	$.ajax({
		url:"/obtenerCargaAcademica",
		success: function(respuesta){
			console.log(respuesta);
			for (var i = 0; i<respuesta.length; i++){
				$("#subirNotasDocente").append('<tr>'+
											'<td>'+respuesta[i].codigo_asignatura+'</td>'+
											'<td>'+respuesta[i].nombre_asignatura+'</td>'+
											'<td>'+respuesta[i].nombre_seccion+'</td>'+
											'<td><button type="button" onclick="ingresarNotas('+respuesta[i].seccion_id+')" class="btn btn-outline-secondary btn-sm">Ingresar</button></td>'+
											'<input type="hidden" id="txt-seccion'+respuesta[i].seccion_id+'" value="'+respuesta[i].seccion_id+'">'+
											'</tr>');
			}
		}
	});
}

function ingresarNotas(codigoSeccion){
	var parametros = "codigoSeccion="+codigoSeccion;
	console.log(parametros);
	$.ajax({
		url:"/obtenerAlumnosSeccion",
		method:"POST",
		data:parametros,
		success:function(respuesta){
			var contenido="";
			contenido += '<table class="table table-responsive-sm">'+
								'<thead>'+
								' <tr class="table-info">'+
								' <th>Numero de Cuenta</th>'+
								'<th>Nombre del Alumno</th>'+
								'<th>Nota</th>'+
								'<th></th>'+
								' </tr>'+
								'</thead>'+
								'<tbody>';

			for (var i = 0; i<respuesta.length; i++){
				contenido += '<tr>'+
								'<td>'+respuesta[i].cuenta_alumno+'</td>'+
								'<td>'+respuesta[i].primer_nombre_persona+' '+respuesta[i].segundo_nombre_persona+' '+respuesta[i].primer_apellido_persona+' '+respuesta[i].segundo_apellido_persona+'</td>'+
								'<td><input type="text" id="promedio'+respuesta[i].alumno_id+'"></td>'+
								'<input type="hidden" id="txt-alumno_id'+respuesta[i].alumno_id+'" value="'+respuesta[i].alumno_id+'">'+
								'<input type="hidden" id="txt-periodo_id'+respuesta[i].periodo_id+'" value="'+respuesta[i].periodo_id+'">'+
								'<td><button onclick="notasGuardadas('+respuesta[i].periodo_id+', '+respuesta[i].alumno_id+', '+codigoSeccion+')" type="button" id="btn-notaAlumno'+respuesta[i].alumno_id+'" class="btn btn-secondary btn-sm">Guardar</button></td>'
								'</tr>';
				
			}
			contenido += '</tbody>'+
							'</table>'+
							'<button onclick="cancelarSubida()" type="button" class="btn btn-secondary">Cancelar</button></div>'; 
		
		$("#contenidoSubirNotas").html(contenido);
		}
	});
}

function notasGuardadas(periodo_id, alumno_id, seccion_id){
	var numeroNota = parseInt($("#promedio"+alumno_id).val());
	if(numeroNota>=65){
		var observacion = "APR";
	}else{
		var observacion = "RPB";
	}
	var parametros = "periodo_id="+$("#txt-periodo_id"+periodo_id).val()+"&"+
						"alumno_id="+$("#txt-alumno_id"+alumno_id).val()+"&"+
						"promedio="+$("#promedio"+alumno_id).val()+"&"+
						"seccion_id="+seccion_id+"&"+
						"observacion="+observacion;
	console.log(parametros);
	$.ajax({
		url:"/notasGuardada",
		data:parametros,
		method:"POST",
		success:function(respuesta){
			console.log(respuesta);
			$("#promedio"+alumno_id).val("");
		}
	});
}

function guardarNotas(){
	$.ajax({
		url:"/obtenerCargaAcademica",
		success: function(respuesta){
			var contenido="";
			contenido += '<table class="table table-responsive-sm">'+
								'<thead>'+
								' <tr class="table-info">'+
								'  <th>Codigo</th>'+
								'<th>Asignatura</th>'+
								' <th>Seccion</th>'+
								'<th>Calificaciones</th>'+
								' </tr>'+
								'</thead>'+
								'<tbody id="subirNotasDocente">';
				for (var i = 0; i<respuesta.length; i++){
				contenido +='<tr>'+
											'<td>'+respuesta[i].codigo_asignatura+'</td>'+
											'<td>'+respuesta[i].nombre_asignatura+'</td>'+
											'<td>'+respuesta[i].nombre_seccion+'</td>'+
											'<td><button type="button" onclick="ingresarNotas('+respuesta[i].seccion_id+')" class="btn btn-outline-secondary btn-sm">Ingresar</button></td>'+
											'<input type="hidden" id="txt-seccion'+respuesta[i].seccion_id+'" value="'+respuesta[i].seccion_id+'">'+
											'</tr>';
			}
		contenido += '</tbody>'+
							'</table>';	
			$("#contenidoSubirNotas").html(contenido);				
		}
	});
}

function cancelarSubida(){
	$.ajax({
		url:"/obtenerCargaAcademica",
		success: function(respuesta){
			var contenido="";
			contenido += '<table class="table table-responsive-sm">'+
								'<thead>'+
								' <tr class="table-info">'+
								'  <th>Codigo</th>'+
								'<th>Asignatura</th>'+
								' <th>Seccion</th>'+
								'<th>Calificaciones</th>'+
								' </tr>'+
								'</thead>'+
								'<tbody id="subirNotasDocente">';
				for (var i = 0; i<respuesta.length; i++){
				contenido +='<tr>'+
											'<td>'+respuesta[i].codigo_asignatura+'</td>'+
											'<td>'+respuesta[i].nombre_asignatura+'</td>'+
											'<td>'+respuesta[i].nombre_seccion+'</td>'+
											'<td><button type="button" onclick="ingresarNotas('+respuesta[i].seccion_id+')" class="btn btn-outline-secondary btn-sm">Ingresar</button></td>'+
											'<input type="hidden" id="txt-seccion'+respuesta[i].seccion_id+'" value="'+respuesta[i].seccion_id+'">'+
											'</tr>';
			}
		contenido += '</tbody>'+
							'</table>';	
			$("#contenidoSubirNotas").html(contenido);				
		}
	});
}

function cargarSeccionesMatricula(){
	$.ajax({
		url:"/cargarSeccionesMatricula",
		success:function(respuesta){
			for (var i = 0; i<respuesta.length; i++){
						var contenido = "";
						contenido += '<tr><td><input value="'+respuesta[i].seccion_id+'" type="radio" name="chkClaseMatricular"></td>'+
						                '<td>'+respuesta[i].codigo_asignatura+'</td>'+
						                '<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
						                '<td>'+respuesta[i].nombre_asignatura+'</td>'+
						                '<td>'+respuesta[i].nombre_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_fin_seccion+'</td>'+
						                '<td>'+respuesta[i].dias_seccion+'</td>';
						$("#asignaturasAdicionar").append(contenido);
					}
		}
	});
}

function cargarSeccionesLaboratorio(){
	$.ajax({
		url:"/cargarSeccionesLaboratorio",
		success:function(respuesta){
			for (var i = 0; i<respuesta.length; i++){
						var contenido = "";
						contenido += '<tr><td><input value="'+respuesta[i].seccion_laboratorio_id+'" type="radio" name="chkLaboratorioMatricular"></td>'+
						                '<td>'+respuesta[i].codigo_asignatura+'</td>'+
						                '<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
						                '<td>'+respuesta[i].nombre_asignatura+'</td>'+
						                '<td>'+respuesta[i].nombre_seccion_lab+'</td>'+
						                '<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_fin_seccion+'</td>'+
						                '<td>'+respuesta[i].dias_seccion+'</td>';
						$("#laboratoriosAdicionar").append(contenido);
					}
		}
	});
}

function matricularClase(){
	var parametros = "seccion_id="+$('input:radio[name=chkClaseMatricular]:checked').val();
	$.ajax({
		url:"/verificarCupos",
		data:parametros,
		method:"POST",
		success:function(respuesta){
			if(respuesta[0].cupos_secciones == 0){
				console.log("Sin cupos");
				guardarNuevaClaseEspera(respuesta[0].seccion_id);
			}else{
				console.log("Con cupos");
				guardarNuevaClase(respuesta[0].seccion_id);
			}
		}
	});
}

function guardarNuevaClase(seccionMatricular){
	var parametros="seccionNuevaClase= "+seccionMatricular;
	console.log(parametros);
	$.ajax({
		url:"/guardarNuevaClase",
		data:parametros,
		method:"POST",
		success:function(respuesta){
			console.log(respuesta);
			$("#cargarAsignaturasAdicionadas").append('<tr>'+
											'<td>'+respuesta[0].codigo_asignatura+'</td>'+
											'<td>'+respuesta[0].cantidad_unidades_valorativas+'</td>'+
											'<td>'+respuesta[0].nombre_asignatura+'</td>'+
											'<td>'+respuesta[0].nombre_seccion+'</td>'+
											'<td>'+respuesta[0].hora_inicio_seccion+'</td>'+
											'<td>'+respuesta[0].hora_fin_seccion+'</td>'+
											'<td>'+respuesta[0].dias_seccion+'</td>'+
											'<td>'+respuesta[0].nombre_edificio+'</td>'+
											'<td>'+respuesta[0].nombre_aula+'</td>'+
											'</tr>');

		}
	});
}

function guardarNuevaClaseEspera(seccionMatricular){
	var parametros="seccionNuevaClaseEspera= "+seccionMatricular;
	console.log(parametros);
	$.ajax({
		url:"/guardarNuevaClaseEspera",
		data:parametros,
		method:"POST",
		success:function(respuesta){
			console.log(respuesta);
			$("#cargarAsignaturasEnEspera").append('<tr>'+
											'<td>'+respuesta[0].codigo_asignatura+'</td>'+
											'<td>'+respuesta[0].cantidad_unidades_valorativas+'</td>'+
											'<td>'+respuesta[0].nombre_asignatura+'</td>'+
											'<td>'+respuesta[0].nombre_seccion+'</td>'+
											'<td>'+respuesta[0].hora_inicio_seccion+'</td>'+
											'<td>'+respuesta[0].hora_fin_seccion+'</td>'+
											'<td>'+respuesta[0].dias_seccion+'</td>'+
											'<td>'+respuesta[0].nombre_edificio+'</td>'+
											'<td>'+respuesta[0].nombre_aula+'</td>'+
											'</tr>');

		}
	});
}

function cancelarAsignaturaSeleccionada(){
	var parametros = "seccion_id="+$('input:radio[name=chkClaseCancelar]:checked').val();
	console.log(parametros);
	$.ajax({
		url:"/cancelarAsignaturaMatriculada",
		data:parametros,
		method:"POST",
		success:function(respuesta){
			var contenido = "";
			console.log(respuesta);
			for (var i = 0; i<respuesta.length; i++){
					
						contenido += '<tr><td><input value="'+respuesta[i].matricula_id+'" type="radio" name="chkClaseCancelar"></td>'+
						                '<td>'+respuesta[i].codigo_asignatura+'</td>'+
						                '<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
						                '<td>'+respuesta[i].nombre_asignatura+'</td>'+
						                '<td>'+respuesta[i].nombre_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_fin_seccion+'</td>'+
						                '<td>'+respuesta[i].dias_seccion+'</td>'+
						                '<td>'+respuesta[i].nombre_edificio+'</td>'+
						                '<td>'+respuesta[i].nombre_aula+'</td></tr>';
						
					}
					$("#contenidoClasesCancelar").html(contenido);
		}
	});

}

function cancelarAsignaturaEsperaSeleccionada(){
	var parametros = "seccion_id="+$('input:radio[name=chkClaseEsperaCancelar]:checked').val();
	console.log(parametros);
	$.ajax({
		url:"/cancelarAsignaturaEspera",
		data:parametros,
		method:"POST",
		success:function(respuesta){
			var contenido = "";
			console.log(respuesta);
			for (var i = 0; i<respuesta.length; i++){
					
						contenido += '<tr><td><input type="radio" value="'+respuesta[i].matricula_id+'" name="chkClaseEsperaCancelar"></td>'+
						                '<td>'+respuesta[i].codigo_asignatura+'</td>'+
						                '<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
						                '<td>'+respuesta[i].nombre_asignatura+'</td>'+
						                '<td>'+respuesta[i].nombre_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
						                '<td>'+respuesta[i].hora_fin_seccion+'</td>'+
						                '<td>'+respuesta[i].dias_seccion+'</td>'+
						                '<td>'+respuesta[i].nombre_edificio+'</td>'+
						                '<td>'+respuesta[i].nombre_aula+'</td></tr>';
						
					}
					$("#contenidoAsignaturasEsperaCancelar").html(contenido);
		}
	});

}

function cancelarLaboratorioSeleccionado(){
	var parametros = "seccion_laboratorio_id="+$('input:radio[name=chkLabCancelar]:checked').val();
	console.log(parametros);
	$.ajax({
		url:"/cancelarLaboratorioMatriculado",
		data:parametros,
		method:"POST",
		success:function(respuesta){
			var contenido = "";
			console.log(respuesta);
			for (var i = 0; i<respuesta.length; i++){
					
						contenido +='<tr>'+
									'<td><input value="'+respuesta[i].matricula_lab_id+'" name="chkLabCancelar" type="radio"></td>'+
									'<td>'+respuesta[i].codigo_asignatura+'</td>'+
									'<td>'+respuesta[i].cantidad_unidades_valorativas+'</td>'+
									'<td>'+respuesta[i].nombre_asignatura+'</td>'+
									'<td>'+respuesta[i].nombre_seccion_lab+'</td>'+
									'<td>'+respuesta[i].hora_inicio_seccion+'</td>'+
									'<td>'+respuesta[i].hora_fin_seccion+'</td>'+
									'<td>'+respuesta[i].dias_seccion+'</td>'+
									'<td>'+respuesta[i].nombre_edificio+'</td>'+
									'<td>'+respuesta[i].nombre_aula+'</td>'+
									'</tr>';
						
					}
					$("#labCancelar").html(contenido);
		}
	});

}

function matricularLaboratorio(){
	var parametros = "seccion_laboratorio_id="+$('input:radio[name=chkLaboratorioMatricular]:checked').val();
	console.log(parametros);
	$.ajax({
		url:"/guardarNuevoLaboratorio",
		data:parametros,
		method:"POST",
		success:function(respuesta){
			console.log(respuesta);
			$("#datosLaboratoriosMatriculados").append('<tr>'+
											'<td>'+respuesta[0].codigo_asignatura+'</td>'+
											'<td>'+respuesta[0].cantidad_unidades_valorativas+'</td>'+
											'<td>'+respuesta[0].nombre_asignatura+'</td>'+
											'<td>'+respuesta[0].nombre_seccion_lab+'</td>'+
											'<td>'+respuesta[0].hora_inicio_seccion+'</td>'+
											'<td>'+respuesta[0].hora_fin_seccion+'</td>'+
											'<td>'+respuesta[0].dias_seccion+'</td>'+
											'<td>'+respuesta[0].nombre_edificio+'</td>'+
											'<td>'+respuesta[0].nombre_aula+'</td>'+
											'</tr>');

		}
	});
}