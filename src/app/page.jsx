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
      <section className="bg-durazno">
        <div className="grid items-center md:grid-cols-2">
          <div className="p-8 md:p-12">
            <p className="texto-pequeno">Papelería para estudiar y crear</p>
            <h1>Ordena tus ideas con estilo</h1>
            <p>Encuentra cuadernos, lápices y accesorios para acompañar tus proyectos.</p>
            <Link className="boton" href="/productos">Ver productos</Link>
          </div>
          <img
            className="h-[420px] w-full object-cover"
            src="/imagenes/escritorio.jpg"
            alt="Cuaderno y lápices sobre un escritorio"
          />
        </div>
      </section>

      <section className="px-4 py-8 md:px-8 md:py-12">
        <h2 className="mb-4">Categorías destacadas</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categorias.map((categoria) => (
            <article className="h-full border-b-4 border-dorado bg-white p-5" key={categoria.nombre}>
              <h3>{categoria.nombre}</h3>
              <p>{categoria.texto}</p>
              <Link href="/productos">{categoria.enlace}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-8 md:px-8 md:py-12">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div>
            <h2>Un espacio para aprender</h2>
            <p>Conoce los materiales básicos para comenzar a practicar lettering.</p>
          </div>
          <iframe
            className="aspect-video w-full border-0"
            src="https://www.youtube.com/embed/b1la8oqT6Cw"
            title="Curso de lettering para principiantes"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <aside className="bg-oliva p-4 text-center text-white">
        Envíos dentro de Santiago y retiro gratuito en nuestro local.
      </aside>
    </>
  );
}
