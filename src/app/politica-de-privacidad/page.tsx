import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">Política de Privacidad</h1>
        <div className="prose dark:prose-invert text-gray-600 dark:text-gray-400">
          <p>
            En Grupo Premia respetamos tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tus datos personales...
          </p>
          {/* Static Content placeholder */}
          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">Uso de la Información</h2>
          <p>
            Utilizamos la información recopilada exclusivamente para procesar tus pedidos de reconocimientos personalizados, contactarte en relación con tu compra, y mejorar tu experiencia de usuario en nuestra plataforma interactiva.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
