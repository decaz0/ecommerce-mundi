import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-white pt-16 pb-8 border-t border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-2xl font-black tracking-tighter text-premia-red">
              GRUPO PREMIA
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              La empresa líder de reconocimientos más grande de Centro América, con más de 40 años de historia celebrando tus logros.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">Contacto</h4>
            <p className="text-sm text-gray-400">
              Para cotizaciones, diseño personalizado y servicio al cliente, escríbenos a:
            </p>
            <a 
              href="mailto:info@grupopremia.com" 
              className="text-premia-red font-bold hover:underline"
            >
              info@grupopremia.com
            </a>
            {/* Note: As per requirements, no phone numbers are included. */}
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li>
                <Link href="/politica-de-privacidad" className="hover:text-premia-red transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/seguridad" className="hover:text-premia-red transition-colors">
                  Política de Seguridad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-premia-red transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Grupo Premia. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholders */}
            <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-premia-red hover:text-white transition-colors">
              in
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-premia-red hover:text-white transition-colors">
              fb
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-premia-red hover:text-white transition-colors">
              ig
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
