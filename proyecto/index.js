var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser');

app.use(express.static("public"));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var conexion = mysql.createConnection({
	user:"root",
	host:"localhost",
	password:"",
	port:"3306",
	database:"db_unah"

});

	app.post("/cambioCentro", function (peticion, respuesta) {
		conexion.query("SELECT campus_id, nombre_campus "+
						"FROM tbl_campus "+
						"where campus_id != ?;",
						[
							peticion.body.centroActual
						],function(error,informacion,campos){
							if (error) throw error;
							respuesta.send(informacion);
						}
			);
	});


	app.post("/cambiarCarrera", function(peticion, respuesta) {
		conexion.query("SELECT carrera_id, nombre_carrera "+
						"FROM tbl_carreras "+
						"where carrera_id != ?;",
						[
						peticion.body.carreraActual
						], function(error,informacion,campos){
							if (error) throw error;
							respuesta.send(informacion);
						}

			);
	});

	app.get("/cancelarClases", function(peticion, respuesta){
			conexion.query("SELECT E.matricula_id, E.alumno_id, B.codigo_asignatura, B.cantidad_unidades_valorativas, B.nombre_asignatura, A.nombre_seccion, A.hora_inicio_seccion, A.hora_fin_seccion, A.dias_seccion, D.nombre_edificio, C.nombre_aula  "+
								"FROM tbl_secciones AS A "+
								"INNER JOIN tbl_asignaturas AS B ON A.asignatura_id = B.asignatura_id "+
								"INNER JOIN tbl_aulas AS C ON A.aula_id = C.aula_id "+
								"INNER JOIN tbl_edificios AS D ON C.edificio_id = D.edificio_id "+
								"INNER JOIN tbl_matricula AS E ON E.seccion_id = A.seccion_id "+
								"WHERE E.estado_matricula_id = 1 and E.alumno_id = 1;", function(error,informacion,campos){
							respuesta.send(informacion);
						}

			);
	});

	app.get("/asignaturasEspera", function(peticion,respuesta){
		conexion.query("SELECT  E.matricula_id, E.alumno_id, B.codigo_asignatura, B.cantidad_unidades_valorativas, B.nombre_asignatura, A.nombre_seccion, A.hora_inicio_seccion, A.hora_fin_seccion, A.dias_seccion, D.nombre_edificio, C.nombre_aula "+ 
								"FROM tbl_secciones AS A "+
								"INNER JOIN tbl_asignaturas AS B ON A.asignatura_id = B.asignatura_id "+
								"INNER JOIN tbl_aulas AS C ON A.aula_id = C.aula_id "+
								"INNER JOIN tbl_edificios AS D ON C.edificio_id = D.edificio_id "+
								"INNER JOIN tbl_matricula AS E ON E.seccion_id = A.seccion_id "+
								"WHERE E.estado_matricula_id = 2 AND E.alumno_id = 1;",function(error,informacion,campos){
				respuesta.send(informacion);
			}
		);
	});

/*app.get("/cancelarAsignaturasEspera", function(peticion, respuesta){
			conexion.query("SELECT E.matricula_id, E.alumno_id, B.codigo_asignatura, B.cantidad_unidades_valorativas, B.nombre_asignatura, A.nombre_seccion, A.hora_inicio_seccion, A.hora_fin_seccion, A.dias_seccion, D.nombre_edificio, C.nombre_aula "+ 
								"FROM tbl_secciones AS A "+
								"INNER JOIN tbl_asignaturas AS B ON A.asignatura_id = B.asignatura_id "+
								"INNER JOIN tbl_aulas AS C ON A.aula_id = C.aula_id "+
								"INNER JOIN tbl_edificios AS D ON C.edificio_id = D.edificio_id "+
								"INNER JOIN tbl_matricula AS E ON E.seccion_id = A.seccion_id "+
								"WHERE E.estado_matricula_id = 2 AND E.alumno_id = 1;", function(error,informacion,campos){
							respuesta.send(informacion);
						}

			);
	});*/
	app.post("/guardarNuevoCentro", function(peticion, respuesta){
		respuesta.send(peticion.body);
	});

	app.post("/guardarNuevoCarrera", function(peticion, respuesta){
		respuesta.send(peticion.body);
	});

	app.post("/guardarNuevoCorreo", function(peticion, respuesta){
		conexion.query("UPDATE tbl_personas SET correo_electronico_persona= ? WHERE persona_id = 1;",
			[
			peticion.body.correoNuevo
			],
			function(error, resultado){
				if (resultado.affectedRows==1){
					conexion.query("select * "+
									"from tbl_personas "+
									"where persona_id = 1;", function(errorSelect, informacion, campos){
										if (errorSelect) throw errorSelect;
										respuesta.send(informacion);
									});
				}
			});
	});

		app.post("/guardarNuevoContrasenia", function(peticion, respuesta){
		respuesta.send(peticion.body);
	});


app.get("/cargarHistorialAcademico", function(peticion, respuesta){
	conexion.query("select a.cuenta_alumno, b.persona_id, b.primer_nombre_persona, b.segundo_nombre_persona, b.primer_apellido_persona, b.segundo_apellido_persona, b.foto, b.nombre_campus, b.promedio_alumno, b.alumno_id, b.carrera_id, b.nombre_carrera "+
					"from tbl_alumnos a "+
					"inner join (select a.persona_id, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, a.foto, a.nombre_campus, a.promedio_alumno, b.alumno_id, b.carrera_id, b.nombre_carrera "+
					"from (select a.persona_id, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, a.foto, a.nombre_campus, b.promedio_alumno " +
					"from (select a.persona_id, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, a.foto, b.nombre_campus "+
					"from tbl_personas a "+
					"inner join tbl_campus b on a.campus_id = b.campus_id) a "+
					"inner join tbl_alumnos b on a.persona_id = b.alumno_id) a "+
					"inner join (select a.alumno_id, a.carrera_id, b.nombre_carrera "+
					"from tbl_alumnos_carreras a "+
					"inner join tbl_carreras b on a.carrera_id = b.carrera_id) b on a.persona_id = b.alumno_id) b on a.alumno_id = b.alumno_id "+
					"where a.alumno_id = 1;", function(error, informacion, campos){
						if (error) throw error;
						respuesta.send(informacion);
					}
		);
});

app.get("/cargarDatosHistorialAcademico", function(peticion, respuesta){
	conexion.query("select a.periodo_id, a.nombre_periodo, b.historial_id, b.promedio, b.observacion, b.alumno_id, b.periodo_id, b.nombre_seccion, b.nombre_asignatura, b.codigo_asignatura, b.cantidad_unidades_valorativas "+
					"from tbl_periodos a "+
					"inner join (select a.historial_id, a.promedio, a.observacion, a.alumno_id, b.periodo_id, b.nombre_seccion, b.nombre_asignatura, b.codigo_asignatura, b.cantidad_unidades_valorativas "+
					"from tbl_historial a "+
					"inner join (select a.periodo_id, a.nombre_seccion, b.nombre_asignatura, a.seccion_id, b.codigo_asignatura, b.cantidad_unidades_valorativas "+
					"from tbl_secciones a "+
					"inner join tbl_asignaturas b on a.asignatura_id = b.asignatura_id) b on a.seccion_id = b.seccion_id) b on a.periodo_id = b.periodo_id "+
					"where b.alumno_id = 1;", function(error, informacion, campos){
						if (error) throw error;
						respuesta.send(informacion);
					}
		);
});

app.get("/obtenerDatosForma03", function(peticion, respuesta){
	conexion.query("select a.alumno_id, a.foto, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, a.campus_id, a.cuenta_alumno, a.nombre_campus, a.nombre_periodo, b.carrera_id, b.nombre_carrera "+
					"from (select a.alumno_id, a.foto, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, a.campus_id, a.cuenta_alumno, a.nombre_campus, b.nombre_periodo "+
					"from (select b.alumno_id, a.foto, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, a.campus_id, b.cuenta_alumno, c.nombre_campus "+
					"from tbl_personas a "+
					"inner join tbl_alumnos b on a.persona_id = b.alumno_id "+
					"inner join tbl_campus c on a.campus_id = c.campus_id) a "+
					"inner join (select b.alumno_id, b.estado_matricula_id, a.periodo_id, a.seccion_id, b.matricula_id, c.nombre_periodo "+
					"from tbl_secciones a "+
					"inner join tbl_matricula b on a.seccion_id = b.seccion_id "+
					"inner join tbl_periodos c on a.periodo_id = c.periodo_id "+
					"where b.estado_matricula_id = 1) b on a.alumno_id = b.alumno_id) a "+
					"inner join (select a.carrera_id, a.nombre_carrera ,b.alumno_id "+
					"from tbl_carreras a "+
					"inner join tbl_alumnos_carreras b on a.carrera_id = b.carrera_id) b on a.alumno_id = b.alumno_id "+
					"where a.alumno_id = 1 "+
					"limit 1;", function(error, informacion, campos){
						if (error) throw error;
						respuesta.send(informacion);
					});
});

app.get("/obtenerClasesForma03", function(peticion, respuesta){
	conexion.query("select a.seccion_id, a.alumno_id, a.estado_matricula_id, b.codigo_asignatura, b.aula_id, b.cantidad_unidades_valorativas, b.nombre_asignatura, b.nombre_seccion, b.hora_inicio_seccion, b.hora_fin_seccion, b.dias_seccion, b.nombre_edificio, b.nombre_aula "+
					"from tbl_matricula a "+
					"inner join (select a.seccion_id, b.codigo_asignatura, a.aula_id, b.cantidad_unidades_valorativas, b.nombre_asignatura, a.nombre_seccion, a.hora_inicio_seccion, a.hora_fin_seccion, a.dias_seccion, c.nombre_edificio, c.nombre_aula "+
					"from tbl_secciones a "+
					"inner join tbl_asignaturas b on a.asignatura_id = b.asignatura_id "+
					"inner join (select a.aula_id, b.nombre_edificio, a.nombre_aula "+
					"from tbl_aulas a "+
					"inner join tbl_edificios b on a.edificio_id = b.edificio_id) c on a.aula_id = c.aula_id) b on a.seccion_id = b.seccion_id "+
					"where a.estado_matricula_id = 1 and a.alumno_id = 1;", function(error, informacion, campos){
						if (error) throw error;
						respuesta.send(informacion);
					});
});

app.get("/obtenerLaboratoriosForma03", function(peticion, respuesta){
	conexion.query("select a.matricula_lab_id, a.estado_matricula_id, a.seccion_laboratorio_id, a.alumno_id, a.estado_matricula_id, b.nombre_seccion_lab, b.hora_inicio_seccion, b.hora_fin_seccion, b.dias_seccion, b.laboratorio_id, b.aula_id, b.periodo_id, b.nombre_periodo, b.nombre_asignatura, b.codigo_asignatura, b.cantidad_unidades_valorativas, b.nombre_aula, b.nombre_edificio "+
					"from tbl_matricula_laboratorios a "+
					"inner join (select a.seccion_laboratorio_id, a.nombre_seccion_lab, a.hora_inicio_seccion, a.hora_fin_seccion, a.dias_seccion, a.laboratorio_id, a.aula_id, a.periodo_id, b.nombre_periodo, c.nombre_asignatura, c.codigo_asignatura, c.cantidad_unidades_valorativas, d.nombre_aula, d.nombre_edificio "+
					"from tbl_secciones_laboratorios a "+
					"inner join tbl_periodos b on a.periodo_id = b.periodo_id "+
					"inner join (select a.laboratorio_id, b.asignatura_id, b.nombre_asignatura, b.codigo_asignatura, b.cantidad_unidades_valorativas "+
					"from tbl_laboratorios a "+
					"inner join tbl_asignaturas b on a.asignatura_id = b.asignatura_id) c on a.laboratorio_id = c.laboratorio_id "+
					"inner join (select a.aula_id, b.edificio_id, a.nombre_aula, b.nombre_edificio "+
					"from tbl_aulas a "+
					"inner join tbl_edificios b on a.edificio_id = b.edificio_id) d on a.aula_id = d.aula_id) b on a.seccion_laboratorio_id = b.seccion_laboratorio_id "+
					"where a.alumno_id = 1 and a.estado_matricula_id = 1;", function(error, informacion, campos){
						if (error) throw error;
						respuesta.send(informacion);
					});
});

app.get("/cargarDatosCalificaciones", function(peticion, respuesta){
	conexion.query("select a.alumno_id, a.foto, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, a.nombre_carrera, a.campus_id, a.cuenta_alumno, a.nombre_campus, b.nombre_periodo "+ 
					"from (select b.alumno_id, a.foto, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, d.nombre_carrera, a.campus_id, b.cuenta_alumno, c.nombre_campus "+ 
					"from tbl_personas a "+ 
					"inner join tbl_alumnos b on a.persona_id = b.alumno_id "+ 
					"inner join tbl_campus c on a.campus_id = c.campus_id "+
					"inner join (select a.carrera_id, a.nombre_carrera ,b.alumno_id "+ 
					"from tbl_carreras a "+ 
					"inner join tbl_alumnos_carreras b on a.carrera_id = b.carrera_id) d on a.persona_id = d.alumno_id) a "+
					"inner join (select a.periodo_id, a.alumno_id, b.nombre_periodo "+
					"from tbl_historial a "+
					"inner join tbl_periodos b on a.periodo_id = b.periodo_id "+
					"where a.periodo_id = 15 "+
					"limit 1) b on a.alumno_id = b.alumno_id "+
					"where a.alumno_id = 1;", function(error, informacion, campos){
							if (error) throw error;
							respuesta.send(informacion);
					});
});

app.get("/cargarNotasCalificaciones", function(peticion, respuesta){
	conexion.query("select a.periodo_id, a.nombre_periodo, b.historial_id, b.promedio, b.observacion, b.alumno_id, b.periodo_id, b.nombre_seccion, b.nombre_asignatura, b.codigo_asignatura, b.cantidad_unidades_valorativas "+
					"from tbl_periodos a "+
					"inner join (select a.historial_id, a.promedio, a.observacion, a.alumno_id, b.periodo_id, b.nombre_seccion, b.nombre_asignatura, b.codigo_asignatura, b.cantidad_unidades_valorativas "+
					"from tbl_historial a "+
					"inner join (select a.periodo_id, a.nombre_seccion, b.nombre_asignatura, a.seccion_id, b.codigo_asignatura, b.cantidad_unidades_valorativas "+
					"from tbl_secciones a "+
					"inner join tbl_asignaturas b on a.asignatura_id = b.asignatura_id) b on a.seccion_id = b.seccion_id) b on a.periodo_id = b.periodo_id "+
					"where b.alumno_id = 1 and a.periodo_id = 15;", function(error, informacion, campos){
						if (error) throw error;
						respuesta.send(informacion);
					});
});

app.get("/cargarDatosCambios", function(peticion, respuesta){
	conexion.query("select a.alumno_id, a.foto, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, a.campus_id, a.cuenta_alumno, a.nombre_campus,  b.carrera_id, b.nombre_carrera "+
					"from (select a.alumno_id, a.foto, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, a.campus_id, a.cuenta_alumno, a.nombre_campus, b.nombre_periodo "+
					"from (select b.alumno_id, a.foto, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, a.campus_id, b.cuenta_alumno, c.nombre_campus "+
					"from tbl_personas a "+
					"inner join tbl_alumnos b on a.persona_id = b.alumno_id "+
					"inner join tbl_campus c on a.campus_id = c.campus_id) a "+
					"inner join (select b.alumno_id, b.estado_matricula_id, a.periodo_id, a.seccion_id, b.matricula_id, c.nombre_periodo "+
					"from tbl_secciones a "+
					"inner join tbl_matricula b on a.seccion_id = b.seccion_id "+
					"inner join tbl_periodos c on a.periodo_id = c.periodo_id "+
					"where b.estado_matricula_id = 1) b on a.alumno_id = b.alumno_id) a "+
					"inner join (select a.carrera_id, a.nombre_carrera ,b.alumno_id "+
					"from tbl_carreras a "+
					"inner join tbl_alumnos_carreras b on a.carrera_id = b.carrera_id) b on a.alumno_id = b.alumno_id "+
					"where a.alumno_id = 1 "+
					"limit 1;", function(error, informacion, campos){
						if (error) throw error;
						respuesta.send(informacion);
					});
});

app.get("/obtenerInfoDocente", function(peticion, respuesta){
	conexion.query("select c.maestro_id, c.numero_empleado, a.campus_id, b.nombre_campus, a.primer_nombre_persona, a.segundo_nombre_persona, a.primer_apellido_persona, a.segundo_apellido_persona, c.nombre_carrera, a.foto "+
					"from tbl_personas a "+
					"inner join tbl_campus b on a.campus_id = b.campus_id "+
					"inner join (select a.maestro_id, b.numero_empleado, c.nombre_carrera "+
					"from tbl_maestros a "+
					"inner join tbl_empleados b on a.maestro_id = b.empleado_id "+
					"inner join tbl_carreras c on a.departamento_id = c.carrera_id) c on a.persona_id = c.maestro_id "+
					"where c.maestro_id = 2;", function(error, informacion, campos){
						if (error) throw error;
						respuesta.send(informacion);
});
});

app.get("/obtenerCargaAcademica", function(peticion, respuesta){
	conexion.query("select a.seccion_id, a.maestro_id, b.codigo_asignatura, a.aula_id, b.cantidad_unidades_valorativas, b.nombre_asignatura, a.nombre_seccion, a.hora_inicio_seccion, a.hora_fin_seccion, a.dias_seccion, c.nombre_edificio, c.nombre_aula "+ 
					"from tbl_secciones a "+ 
					"inner join tbl_asignaturas b on a.asignatura_id = b.asignatura_id "+ 
					"inner join (select a.aula_id, b.nombre_edificio, a.nombre_aula "+ 
					"from tbl_aulas a "+ 
					"inner join tbl_edificios b on a.edificio_id = b.edificio_id) c on a.aula_id = c.aula_id "+
					"where a.maestro_id = 2;", function(error, informacion, campos){
						if (error) throw error;
						respuesta.send(informacion);
					});
});

app.post("/obtenerAlumnosSeccion", function(peticion, respuesta){
	conexion.query("select a.alumno_id, a.seccion_id, b.primer_nombre_persona, b.segundo_nombre_persona, b.primer_apellido_persona, b.segundo_apellido_persona, c.cuenta_alumno, d.periodo_id "+
					"from tbl_matricula a "+
					"inner join tbl_personas b on a.alumno_id = b.persona_id "+
					"inner join tbl_alumnos c on a.alumno_id = c.alumno_id "+
					"inner join tbl_secciones d on a.seccion_id = d.seccion_id "+
					"where a.seccion_id = ?;",
					[
						peticion.body.codigoSeccion
					], function(error, informacion, campos){
						if (error) throw error;
						respuesta.send(informacion);

					});
});

app.get("/cargarSeccionesMatricula", function(peticion, respuesta){
	conexion.query("select a.seccion_id, b.codigo_asignatura, a.aula_id, a.periodo_id, b.cantidad_unidades_valorativas, b.nombre_asignatura, a.nombre_seccion, a.hora_inicio_seccion, a.hora_fin_seccion, a.dias_seccion, c.nombre_edificio, c.nombre_aula "+ 
	"from tbl_secciones a "+ 
	"inner join tbl_asignaturas b on a.asignatura_id = b.asignatura_id "+ 
	"inner join (select a.aula_id, b.nombre_edificio, a.nombre_aula "+ 
	"from tbl_aulas a "+ 
	"inner join tbl_edificios b on a.edificio_id = b.edificio_id) c on a.aula_id = c.aula_id "+
	"where a.periodo_id = 16;", function(error, informacion, campos){
		if (error) throw error;
		respuesta.send(informacion);
	});
});

app.get("/cargarSeccionesLaboratorio", function(peticion, respuesta){
	conexion.query("select a.seccion_laboratorio_id, a.nombre_seccion_lab, a.hora_inicio_seccion, a.hora_fin_seccion, a.dias_seccion, a.laboratorio_id, a.aula_id, a.periodo_id, b.nombre_periodo, c.nombre_asignatura, c.codigo_asignatura, c.cantidad_unidades_valorativas, d.nombre_aula, d.nombre_edificio "+ 
					"from tbl_secciones_laboratorios a "+ 
					"inner join tbl_periodos b on a.periodo_id = b.periodo_id "+ 
					"inner join (select a.laboratorio_id, b.asignatura_id, b.nombre_asignatura, b.codigo_asignatura, b.cantidad_unidades_valorativas "+ 
					"from tbl_laboratorios a "+ 
					"inner join tbl_asignaturas b on a.asignatura_id = b.asignatura_id) c on a.laboratorio_id = c.laboratorio_id "+ 
					"inner join (select a.aula_id, b.edificio_id, a.nombre_aula, b.nombre_edificio "+
					"from tbl_aulas a "+ 
					"inner join tbl_edificios b on a.edificio_id = b.edificio_id) d on a.aula_id = d.aula_id "+
					"where a.periodo_id = 16;", function(error, informacion, campos){
		if (error) throw error;
		respuesta.send(informacion);
	});
});

app.post("/verificarCupos", function(peticion,respuesta){
	conexion.query("select a.seccion_id, a.cupos_secciones "+
					"from tbl_secciones a "+
					"where a.seccion_id =?;",
					[
					peticion.body.seccion_id
					], function(error,informacion,campos){
						if (error) throw error;
						respuesta.send(informacion);
});
});

app.post("/guardarNuevaClase", function(peticion,respuesta){
	conexion.query("INSERT INTO tbl_matricula(matricula_id, seccion_id, alumno_id, estado_matricula_id, fecha_matricula) "+ 
					"VALUES (NULL, ?, 1, 1, SYSDATE());",
					[
					peticion.body.seccionNuevaClase
					], function(error,resultado){
						if (resultado.affectedRows==1){
						conexion.query("select a.seccion_id, a.alumno_id, a.matricula_id, a.estado_matricula_id, b.codigo_asignatura, b.aula_id, b.cantidad_unidades_valorativas, b.nombre_asignatura, b.nombre_seccion, b.hora_inicio_seccion, b.hora_fin_seccion, b.dias_seccion, b.nombre_edificio, b.nombre_aula "+
					"from tbl_matricula a "+
					"inner join (select a.seccion_id, b.codigo_asignatura, a.aula_id, b.cantidad_unidades_valorativas, b.nombre_asignatura, a.nombre_seccion, a.hora_inicio_seccion, a.hora_fin_seccion, a.dias_seccion, c.nombre_edificio, c.nombre_aula "+
					"from tbl_secciones a "+
					"inner join tbl_asignaturas b on a.asignatura_id = b.asignatura_id "+
					"inner join (select a.aula_id, b.nombre_edificio, a.nombre_aula "+
					"from tbl_aulas a "+
					"inner join tbl_edificios b on a.edificio_id = b.edificio_id) c on a.aula_id = c.aula_id) b on a.seccion_id = b.seccion_id "+
					"where a.estado_matricula_id = 1 and a.alumno_id = 1 and a.matricula_id  = ?;",
							[resultado.insertId],
							function(errorSelect, informacion, campos){
								if (errorSelect) throw errorSelect;
								respuesta.send(informacion);		
							}
						);
					}
			
});
});

app.post("/guardarNuevaClaseEspera", function(peticion,respuesta){
	conexion.query("INSERT INTO tbl_matricula(matricula_id, seccion_id, alumno_id, estado_matricula_id, fecha_matricula) "+ 
					"VALUES (NULL, ?, 1, 2, SYSDATE());",
					[
					peticion.body.seccionNuevaClaseEspera
					], function(error,resultado){
						if (resultado.affectedRows==1){
						conexion.query("select a.seccion_id, a.alumno_id, a.matricula_id, a.estado_matricula_id, b.codigo_asignatura, b.aula_id, b.cantidad_unidades_valorativas, b.nombre_asignatura, b.nombre_seccion, b.hora_inicio_seccion, b.hora_fin_seccion, b.dias_seccion, b.nombre_edificio, b.nombre_aula "+
					"from tbl_matricula a "+
					"inner join (select a.seccion_id, b.codigo_asignatura, a.aula_id, b.cantidad_unidades_valorativas, b.nombre_asignatura, a.nombre_seccion, a.hora_inicio_seccion, a.hora_fin_seccion, a.dias_seccion, c.nombre_edificio, c.nombre_aula "+
					"from tbl_secciones a "+
					"inner join tbl_asignaturas b on a.asignatura_id = b.asignatura_id "+
					"inner join (select a.aula_id, b.nombre_edificio, a.nombre_aula "+
					"from tbl_aulas a "+
					"inner join tbl_edificios b on a.edificio_id = b.edificio_id) c on a.aula_id = c.aula_id) b on a.seccion_id = b.seccion_id "+
					"where a.estado_matricula_id = 2 and a.alumno_id = 1 and a.matricula_id  = ?;",
							[resultado.insertId],
							function(errorSelect, informacion, campos){
								if (errorSelect) throw errorSelect;
								respuesta.send(informacion);		
							}
						);
					}
			
});
});

app.post("/cancelarAsignaturaMatriculada", function(peticion, respuesta){
	conexion.query("DELETE FROM tbl_matricula WHERE matricula_id = ?",
		[
		peticion.body.seccion_id
		], function(error,resultado){
			if (resultado.affectedRows==1){
				conexion.query(
					"SELECT E.matricula_id, E.alumno_id, B.codigo_asignatura, B.cantidad_unidades_valorativas, B.nombre_asignatura, A.nombre_seccion, A.hora_inicio_seccion, A.hora_fin_seccion, A.dias_seccion, D.nombre_edificio, C.nombre_aula  "+
								"FROM tbl_secciones AS A "+
								"INNER JOIN tbl_asignaturas AS B ON A.asignatura_id = B.asignatura_id "+
								"INNER JOIN tbl_aulas AS C ON A.aula_id = C.aula_id "+
								"INNER JOIN tbl_edificios AS D ON C.edificio_id = D.edificio_id "+
								"INNER JOIN tbl_matricula AS E ON E.seccion_id = A.seccion_id "+
								"WHERE E.estado_matricula_id = 1 and E.alumno_id = 1;", function(errorSelect, informacion, campos){
									if (errorSelect) throw errorSelect;
									respuesta.send(informacion);	
								});
			}
		});
});

app.post("/cancelarAsignaturaEspera", function(peticion, respuesta){
	conexion.query("DELETE FROM tbl_matricula WHERE matricula_id = ?",
		[
		peticion.body.seccion_id
		], function(error,resultado){
			if (resultado.affectedRows==1){
				conexion.query(
					"SELECT E.matricula_id, E.alumno_id, B.codigo_asignatura, B.cantidad_unidades_valorativas, B.nombre_asignatura, A.nombre_seccion, A.hora_inicio_seccion, A.hora_fin_seccion, A.dias_seccion, D.nombre_edificio, C.nombre_aula  "+
								"FROM tbl_secciones AS A "+
								"INNER JOIN tbl_asignaturas AS B ON A.asignatura_id = B.asignatura_id "+
								"INNER JOIN tbl_aulas AS C ON A.aula_id = C.aula_id "+
								"INNER JOIN tbl_edificios AS D ON C.edificio_id = D.edificio_id "+
								"INNER JOIN tbl_matricula AS E ON E.seccion_id = A.seccion_id "+
								"WHERE E.estado_matricula_id = 2 and E.alumno_id = 1;", function(errorSelect, informacion, campos){
									if (errorSelect) throw errorSelect;
									respuesta.send(informacion);	
								});
			}
		});
});

app.post("/cancelarLaboratorioMatriculado", function(peticion, respuesta){
	conexion.query("DELETE FROM tbl_matricula_laboratorios WHERE matricula_lab_id = ?",
		[
		peticion.body.seccion_laboratorio_id
		], function(error,resultado){
			if (resultado.affectedRows==1){
				conexion.query(
					"select a.matricula_lab_id, a.estado_matricula_id, a.seccion_laboratorio_id, a.alumno_id, a.estado_matricula_id, b.nombre_seccion_lab, b.hora_inicio_seccion, b.hora_fin_seccion, b.dias_seccion, b.laboratorio_id, b.aula_id, b.periodo_id, b.nombre_periodo, b.nombre_asignatura, b.codigo_asignatura, b.cantidad_unidades_valorativas, b.nombre_aula, b.nombre_edificio "+
					"from tbl_matricula_laboratorios a "+
					"inner join (select a.seccion_laboratorio_id, a.nombre_seccion_lab, a.hora_inicio_seccion, a.hora_fin_seccion, a.dias_seccion, a.laboratorio_id, a.aula_id, a.periodo_id, b.nombre_periodo, c.nombre_asignatura, c.codigo_asignatura, c.cantidad_unidades_valorativas, d.nombre_aula, d.nombre_edificio "+
					"from tbl_secciones_laboratorios a "+
					"inner join tbl_periodos b on a.periodo_id = b.periodo_id "+
					"inner join (select a.laboratorio_id, b.asignatura_id, b.nombre_asignatura, b.codigo_asignatura, b.cantidad_unidades_valorativas "+
					"from tbl_laboratorios a "+
					"inner join tbl_asignaturas b on a.asignatura_id = b.asignatura_id) c on a.laboratorio_id = c.laboratorio_id "+
					"inner join (select a.aula_id, b.edificio_id, a.nombre_aula, b.nombre_edificio "+
					"from tbl_aulas a "+
					"inner join tbl_edificios b on a.edificio_id = b.edificio_id) d on a.aula_id = d.aula_id) b on a.seccion_laboratorio_id = b.seccion_laboratorio_id "+
					"where a.alumno_id = 1 and a.estado_matricula_id = 1;", function(errorSelect, informacion, campos){
									if (errorSelect) throw errorSelect;
									respuesta.send(informacion);	
								});
			}
		});
});
app.post("/guardarNuevoLaboratorio", function(peticion,respuesta){
	conexion.query("INSERT INTO tbl_matricula_laboratorios(matricula_lab_id, fecha_matricula_lab, seccion_laboratorio_id, alumno_id, estado_matricula_id) "+
					"VALUES (NULL, SYSDATE(), ?, 1, 1);",
					[
					peticion.body.seccion_laboratorio_id
					], function(error,resultado){
						if (resultado.affectedRows==1){
						conexion.query("select a.matricula_lab_id, a.estado_matricula_id, a.seccion_laboratorio_id, a.alumno_id, a.estado_matricula_id, b.nombre_seccion_lab, b.hora_inicio_seccion, b.hora_fin_seccion, b.dias_seccion, b.laboratorio_id, b.aula_id, b.periodo_id, b.nombre_periodo, b.nombre_asignatura, b.codigo_asignatura, b.cantidad_unidades_valorativas, b.nombre_aula, b.nombre_edificio "+
					"from tbl_matricula_laboratorios a "+
					"inner join (select a.seccion_laboratorio_id, a.nombre_seccion_lab, a.hora_inicio_seccion, a.hora_fin_seccion, a.dias_seccion, a.laboratorio_id, a.aula_id, a.periodo_id, b.nombre_periodo, c.nombre_asignatura, c.codigo_asignatura, c.cantidad_unidades_valorativas, d.nombre_aula, d.nombre_edificio "+
					"from tbl_secciones_laboratorios a "+
					"inner join tbl_periodos b on a.periodo_id = b.periodo_id "+
					"inner join (select a.laboratorio_id, b.asignatura_id, b.nombre_asignatura, b.codigo_asignatura, b.cantidad_unidades_valorativas "+
					"from tbl_laboratorios a "+
					"inner join tbl_asignaturas b on a.asignatura_id = b.asignatura_id) c on a.laboratorio_id = c.laboratorio_id "+
					"inner join (select a.aula_id, b.edificio_id, a.nombre_aula, b.nombre_edificio "+
					"from tbl_aulas a "+
					"inner join tbl_edificios b on a.edificio_id = b.edificio_id) d on a.aula_id = d.aula_id) b on a.seccion_laboratorio_id = b.seccion_laboratorio_id "+
					"where a.alumno_id = 1 and a.estado_matricula_id = 1 and a.matricula_lab_id = ?;",
							[resultado.insertId],
							function(errorSelect, informacion, campos){
								if (errorSelect) throw errorSelect;
								respuesta.send(informacion);		
							}
						);
					}
			
});
});
app.post("/notasGuardada", function(peticion, respuesta){
	conexion.query("INSERT INTO tbl_historial(historial_id, alumno_id, seccion_id, periodo_id, promedio, observacion) "+
					"VALUES (NULL, ?, ?, ?, ?, ?);",
					[
					peticion.body.alumno_id,
					peticion.body.seccion_id,
					peticion.body.periodo_id,
					peticion.body.promedio,
					peticion.body.observacion
					], function(error, resultado){
						if (resultado.affectedRows==1){
							conexion.query("SELECT * FROM tbl_historial WHERE historial_id = ?",
								[resultado.insertId],
								function(errorSelect, informacion, campos){
								if (errorSelect) throw errorSelect;
								respuesta.send(informacion);	
								});
						}
					});
});
app.listen(3000);