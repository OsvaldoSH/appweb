import React, { useState, useEffect } from "react";
import './FormularioContrato.css'
import { contratosService } from "../../services/contratosService";

const FormularioContrato = ({ onGuardar, onCancelar }) => {
    const [formData, setFormData] = useState({
        clave_sive: '',
        cliente_id: '',
        nombre: '',
        encargado: '',
        direccion: '',
        municipio: '',
        telefono: '',
        ruta_id: '',
        vendedor_id: '',

        numero_serie: '',
        enfriador_id:'',
        marca: '',
        modelo: '',
        tipo: '',
        precio: '',

        comentario: '',
        elaborado_por_id: '',
        autorizado_por_id: ''
    });

    const [empleadosElabora, setEmpleadosElabora ] = useState([]);
    const [empleadosAutoriza, setEmpleadosAutoriza ] = useState([]);

    const [ cargando, setCargando] = useState(false);

    useEffect(() => {
        const cargarEmpleados = async () => {
            try {
                const empleadosData = await contratosService.getEmpleados();

                const elabora = empleadosData.filter(emp =>
                    emp.puesto_id === 2
                );

                const autoriza = empleadosData.filter(emp =>
                    emp.puesto_id === 1 || emp.puesto_id === 3
                );

                setEmpleadosElabora(elabora);
                setEmpleadosAutoriza(autoriza)

                if (elabora.length > 0) {
                    setFormData(prev => ({...prev, elaborado_por_id: elabora[0].id}));
                }

                if (autoriza.length > 0) {
                    setFormData(prev => ({...prev, autorizado_por_id: autoriza[0].id}));
                }

            } catch (error) {
                console.error('Error cargando empleados:', error);
            }
        };
        cargarEmpleados();
    }, []);

    const handleClaveSiveChange = async (clave) => {
        const nuevaClave = clave.toUpperCase();
        setFormData(prev => ({...prev, clave_sive: nuevaClave}));


        if (nuevaClave.length >= 3) {
            setCargando(true);
            try {
                const clienteData = await contratosService.getClienteByClaveSive(nuevaClave);

                if (clienteData) {
                    setFormData(prev => ({
                        ...prev,
                        cliente_id: clienteData.id,
                        nombre: clienteData.nombre,
                        encargado: clienteData.encargado,
                        direccion: clienteData.direccion,
                        municipio: clienteData.municipio,
                        telefono: clienteData.telefono,
                        ruta_id: clienteData.ruta_id,
                        vendedor_id: clienteData.vendedor_id || ''                                                                                                                                                                                                                                                                                                         
                    }));
                } else {
                    limpiarCamposCliente();
                }
            } catch (error) {
                console.error('Error buscado el cliente:', error);
                limpiarCamposCliente();
            } finally {
                setCargando(false);
            }
        } else {
            limpiarCamposCliente();
        }
    };

    const handleNumeroSerieChange = async (serie) => {
        setFormData(prev => ({...prev, numero_serie: serie}));

        if (serie.length >= 7 ){
            setCargando(true);
            try {
                const enfriadorData = await contratosService.getEnfriadorBySerie(serie);
                if (enfriadorData) {
                    setFormData(prev => ({
                        ...prev,
                        enfriador_id: enfriadorData.id,
                        marca: enfriadorData.marca,
                        modelo: enfriadorData.modelo,
                        tipo: enfriadorData.tipo,
                        precio: enfriadorData.precio
                    }));
                } else {
                    limpiarCamposEnfriador();
                }
            } catch (error) {
                console.error('Error buscando el enfriador:', error);
                limpiarCamposEnfriador();
            } finally {
                setCargando(false);
            }     
        } else {
            limpiarCamposEnfriador();
        }
    };

    const limpiarCamposCliente = () => {
        setFormData(prev => ({
            ...prev,
            cliente_id: '',
            nombre: '',
            encargado: '',
            direccion: '',
            municipio: '',
            telefono: '',
            ruta_id: '',
            vendedor_id: '',
        }));
    };

    const limpiarCamposEnfriador = () => {
        setFormData(prev => ({
        ...prev,
        enfriador_id:'',
        marca: '',
        modelo: '',
        tipo: '',
        precio: '',
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.cliente_id || !formData.enfriador_id || !formData.elaborado_por_id || !formData.autorizado_por_id) {
            alert('Por favor complete todos los campos requeridos');
             return;      
        }

        onGuardar(formData);
    };

    return (
        <form className="form-contrato" onSubmit={handleSubmit}>
            {/* Seccion del cliente*/}
            <div className="form-section">
                <h3>Datos del Cliente</h3>
                <div className="form-group">
                    <label>Clave SIVE</label>
                    <input type="text"
                        value={formData.clave_sive}
                        onChange={(e) =>handleClaveSiveChange(e.target.value)}
                        placeholder="Ingrese clave SIVE..."
                        required
                        disabled={cargando}
                    />
                    {cargando && <div className="cargando">Buscando...</div>}
                </div>

                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={formData.nombre} readOnly className="campo-readonly"/>
                </div>

                <div className="form-group">
                    <label>Encargado</label>
                    <input type="text" value={formData.encargado} readOnly className="campo-readonly"/>
                </div>

                <div className="form-group">
                    <label>Direccion</label>
                    <input type="text" value={formData.direccion} readOnly className="campo-readonly"/>
                </div>

                <div className="form-group">
                    <label>Municipio</label>
                    <input type="text" value={formData.municipio} readOnly className="campo-readonly"/>
                </div>

                <div className="form-group">
                    <label>Telefono</label>
                    <input type="text" value={formData.telefono} readOnly className="campo-readonly"/>
                </div>
            </div>

            {/* SECCION ENFRIADOR */}
            <div className="form-section">
                <h3>Datos del Enfriador</h3>

                <div className="form-group">
                    <label>Numero de Serie *</label>
                    <input type="text" value={formData.numero_serie}
                     onChange={(e) => handleNumeroSerieChange(e.target.value)}
                     placeholder="Ingrese el numero de serie..."
                     required
                     disabled={cargando}
                     />
                </div>

                <div className="form-group">
                    <label>Marca</label>
                    <input type="text" value={formData.marca} readOnly className="campo-readonly"/>
                </div>

                <div className="form-group">
                    <label>Modelo</label>
                    <input type="text" value={formData.modelo} readOnly className="campo-readonly"/>
                </div>

                <div className="form-group">
                    <label>Tipo</label>
                    <input type="text" value={formData.tipo} readOnly className="campo-readonly"/>
                </div>

                <div className="form-group">
                    <label>Precio</label>
                    <input type="text" value={`$${formData.precio}`} readOnly className="campo-readonly precio"/>
                </div>
            </div>

            {/* Seccion del contrato */}
            <div className="form-section">
                <h3>Datos del Contrato</h3>

                <div className="form-group">
                    <label>Comentario</label>
                    <textarea
                        value={formData.comentario}
                        onChange={(e) => setFormData({...formData, comentario: e.target.value})}
                        rows="3"
                        placeholder="Observaciones adicionales..."
                    />
                </div>

                <div className="form-group">
                    <label>Elaborado por *</label>
                    <select
                        value={formData.elaborado_por_id}
                        onChange={(e) => setFormData({...formData, elaborado_por_id: e.target.value})}
                        required
                    >
                        <option value="">Seleccione...</option>
                        {empleadosElabora.map(empleado => (
                            <option key={empleado.id} value={empleado.id}>
                                {empleado.nombre} {empleado.apellido}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Autorizado por *</label>
                    <select
                        value={formData.autorizado_por_id}
                        onChange={(e) => setFormData({...formData, autorizado_por_id: e.target.value})}
                        required
                    >
                        <option value="">Seleccione..</option>
                        {empleadosAutoriza.map(empleado => (
                            <option key={empleado.id} value={empleado.id}>
                                {empleado.nombre} {empleado.apellido}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancelar}>Cancelar</button>
                <button type="submit" disabled={cargando}>
                    {cargando ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    );
};

export default FormularioContrato;