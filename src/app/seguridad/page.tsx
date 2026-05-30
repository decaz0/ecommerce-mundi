import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SecurityPolicy() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">Política de Seguridad</h1>
        <div className="prose dark:prose-invert text-gray-600 dark:text-gray-400">
          <p>
            La seguridad de tus datos y transacciones es nuestra prioridad número uno en Grupo Premia. Implementamos medidas técnicas, administrativas y físicas para proteger tu información contra acceso no autorizado, alteración, divulgación o destrucción.
          </p>
          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">Pagos Seguros</h2>
          <p>
            Todas las transacciones en nuestra plataforma utilizan cifrado SSL de extremo a extremo y son procesadas a través de proveedores de pago certificados internacionalmente.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
