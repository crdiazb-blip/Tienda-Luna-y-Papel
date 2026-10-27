import Link from "next/link";

const categorias = [
  {
    nombre: "Cuadernos",
    texto: "Modelos lisos, rayados y punteados para clases o planificación.",
    enlace: "Revisar cuadernos",
  },
  {
    nombre: "Escritura",
    texto: "Lápices, destacadores y marcadores de distintos colores.",
    enlace: "Revisar lápices",
  },
  {
    nombre: "Organización",
    texto: "Agendas, notas adhesivas y carpetas para ordenar tus tareas.",
    enlace: "Revisar accesorios",
  },
];

export default function Inicio() {
  return (
    <>
      <section className="presentacion">
        <div className="row g-0 align-items-center">
          <div className="col-md-6 p-4 p-md-5">
            <p className="texto-pequeno">Papelería para estudiar y crear</p>
            <h1>Ordena tus ideas con estilo</h1>
            <p>Encuentra cuadernos, lápices y accesorios para acompañar tus proyectos.</p>
            <Link className="btn btn-luna" href="/productos">Ver productos</Link>
          </div>
          <div className="col-md-6">
            <img
              className="img-fluid w-100 imagen-portada"
              src="/imagenes/escritorio.jpg"
              alt="Cuaderno y lápices sobre un escritorio"
            />
          </div>
        </div>
      </section>

      <section className="py-4 py-md-5 px-3 px-md-4">
        <h2 className="mb-4">Categorías destacadas</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {categorias.map((categoria) => (
            <div className="col" key={categoria.nombre}>
              <article className="card h-100 tarjeta-categoria">
                <div className="card-body">
                  <h3 className="h5 card-title">{categoria.nombre}</h3>
                  <p className="card-text">{categoria.texto}</p>
                  <Link href="/productos">{categoria.enlace}</Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="py-4 py-md-5 px-3 px-md-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <h2>Un espacio para aprender</h2>
            <p>Conoce los materiales básicos para comenzar a practicar lettering.</p>
          </div>
          <div className="col-md-6">
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/b1la8oqT6Cw"
                title="Curso de lettering para principiantes"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <aside className="informacion">
        Envíos dentro de Santiago y retiro gratuito en nuestro local.
      </aside>
    </>
  );
}
