import Link from "next/link";

function PiePagina() {
  return (
    <footer className="mt-8 bg-oliva p-5 text-center text-white">
      <p className="mb-2">Luna y Papel | Ñuñoa, Santiago | hola@lunaypapel.cl</p>
      <Link className="text-sm underline" href="/admin">Administración</Link>
    </footer>
  );
}

export default PiePagina;
