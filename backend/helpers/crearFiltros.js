
const crearFiltros = (filtros,arrayOpciones) =>{
    let cadena = "";
    let valido = true;
    Object.keys(filtros).forEach(key => {
        if (!arrayOpciones.includes(key) && ["asc", "desc"].includes(filtros[key])) {
            cadena += `"${key}":"${filtros[key]}",`;
        } else if (!arrayOpciones.includes(key) && !["asc", "desc"].includes(filtros[key])) {
            valido = false;
        }
    });
    /*if (!valido) {
        return filtros.status(406).json({
            ok: false,
            msg: `Los parametros que no sean ${arrayOpciones} deben ser asc o desc`,
        });
    }*/
    let formateado = "{" + cadena + "}";

    let filt = formateado.slice(0, formateado.length - 2);

    let filtrado = filt + "}";
    let filtrosFormateados;
    try {
        filtrosFormateados = JSON.parse(filtrado);
    } catch (e) {
        //console.log(e);
    }  
    return filtrosFormateados;
}
module.exports = { crearFiltros }