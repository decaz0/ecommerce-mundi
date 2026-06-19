import Link from "next/link";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { LayoutDashboard, Package, Palette, Trophy, Layers, Type, LogOut, FolderTree } from "lucide-react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/productos", label: "Productos", icon: <Package size={18} /> },
  ];

  const catalogLinks = [
    { href: "/admin/catalogos/categorias", label: "Categorías", icon: <FolderTree size={18} /> },
    { href: "/admin/catalogos/colores", label: "Colores", icon: <Palette size={18} /> },
    { href: "/admin/catalogos/figuras", label: "Figuras", icon: <Trophy size={18} /> },
    { href: "/admin/catalogos/bases", label: "Bases", icon: <Layers size={18} /> },
    { href: "/admin/catalogos/tipografias", label: "Tipografías", icon: <Type size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col shrink-0 border-r border-gray-50/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="p-8 flex flex-col items-start justify-center">
          <img src="/logo-premia.png" alt="Grupo Premia" className="h-8 object-contain opacity-90" />
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-8 mt-2">
          {/* General */}
          <div>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3 px-3">General</p>
            <ul className="space-y-1">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50/80 text-gray-500 hover:text-gray-800 transition-all duration-300 text-sm font-medium group">
                    <span className="opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all text-gray-400 group-hover:text-premia-red">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Catálogos */}
          <div>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3 px-3">Inventario</p>
            <ul className="space-y-1">
              {catalogLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50/80 text-gray-500 hover:text-gray-800 transition-all duration-300 text-sm font-medium group">
                    <span className="opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all text-gray-400 group-hover:text-premia-red">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User Footer */}
        <div className="p-4 mt-auto">
          <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50/50 rounded-2xl transition-colors">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center shrink-0 border border-gray-100">
                <span className="text-xs font-semibold text-gray-600">{session?.user?.name?.[0] || "A"}</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-gray-700 truncate">{session?.user?.name || "Administrador"}</p>
                <p className="text-[10px] text-gray-400 truncate">{session?.user?.email || "admin@grupopremia.com"}</p>
              </div>
            </div>
            <a href="/api/auth/signout" className="text-gray-400 hover:text-premia-red transition-colors shrink-0" title="Cerrar sesión">
              <LogOut size={16} />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#FAFAFA] p-8 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
