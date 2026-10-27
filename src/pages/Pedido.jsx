import { useSearchParams } from "react-router-dom";
import FormularioPedido from "../components/FormularioPedido";
import { productos, buscarProducto } from "../data/productos";

function Pedido() {
  const [parametros] = useSearchParams();
  const idPedido = parametros.get("producto");
  const productoInicial = buscarProducto(idPedido) ? idPedido : "";

  return (
    <>
      <section className="titulo">
        <p className="texto-pequeno">Pedido de demostración</p>
        <h1>Solicita tu pedido</h1>
        <p>Completa los datos y revisa el total calculado.</p>
      </section>

      <section className="py-4 py-md-5 px-3 px-md-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <FormularioPedido productos={productos} productoInicial={productoInicial} />
          </div>
          <div className="col-lg-4">
            <aside className="resumen">
              <h2 className="h4">Información de compra</h2>
              <p>El formulario calcula el valor según el producto y la cantidad.</p>
              <p>Retiro: Avenida Irarrázaval 1800, Ñuñoa.</p>
              <p>Horario: lunes a sábado, de 10:00 a 18:00.</p>
              <p className="mb-0">
                Proyecto académico: esta página no cobra, no envía correos ni guarda pedidos.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

export default Pedido;
