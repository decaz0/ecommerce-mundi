import { prisma } from "@/lib/prisma";
import { deleteTypography } from "@/actions/catalogActions";
import TypographyForm from "./TypographyForm";

const PREVIEW_TEXT = "AaBbCc 123 ¡Hola Mundo!";

export default async function TypographyCatalogPage() {
  const typographies = await prisma.typography.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🔤 Catálogo de Tipografías</h1>
        <p className="text-sm text-gray-500 mt-1">
          Sube los archivos de fuente (<code className="bg-gray-100 px-1 rounded text-xs">.ttf</code>, <code className="bg-gray-100 px-1 rounded text-xs">.otf</code>, <code className="bg-gray-100 px-1 rounded text-xs">.woff</code>, <code className="bg-gray-100 px-1 rounded text-xs">.woff2</code>) que el sistema usará para personalizar el texto de los trofeos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulario con upload */}
        <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-100 h-fit">
          <h2 className="font-bold mb-4 text-gray-800">Añadir Tipografía</h2>
          <TypographyForm />
        </div>

        {/* Listado */}
        <div className="md:col-span-2">
          {typographies.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="text-5xl mb-3">🔤</div>
              <p className="text-gray-500 font-medium">No hay tipografías registradas.</p>
              <p className="text-gray-400 text-sm mt-1">Sube tu primer archivo de fuente con el formulario.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {typographies.map(typo => (
                <div key={typo.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
                  {/* @font-face para preview */}
                  {typo.fontUrl && (
                    <style>{`
                      @font-face {
                        font-family: 'typo-${typo.id}';
                        src: url('${typo.fontUrl}');
                        font-display: swap;
                      }
                    `}</style>
                  )}

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{typo.name}</h3>
                        {typo.fontUrl && (
                          <p className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-xs">
                            📁 {typo.fontUrl.split("/").pop()}
                          </p>
                        )}
                      </div>
                      <form action={async () => { "use server"; await deleteTypography(typo.id); }}>
                        <button className="text-red-400 hover:text-red-600 text-sm font-medium transition px-3 py-1 rounded-lg hover:bg-red-50">
                          Eliminar
                        </button>
                      </form>
                    </div>

                    {/* Preview de texto */}
                    {typo.fontUrl ? (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p style={{ fontFamily: `'typo-${typo.id}', serif` }} className="text-3xl text-gray-800 mb-1">
                          {PREVIEW_TEXT}
                        </p>
                        <p style={{ fontFamily: `'typo-${typo.id}', serif` }} className="text-sm text-gray-500">
                          El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón.
                        </p>
                        <p style={{ fontFamily: `'typo-${typo.id}', serif` }} className="text-xs text-gray-400 mt-1">
                          0123456789 !@#$%^&*()
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                        ⚠️ Esta tipografía fue creada sin archivo de fuente. Elimínala y vuelve a crearla subiendo un archivo.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
