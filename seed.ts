import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando el seeding extenso de la base de datos...");

  // 1. Limpiar la base de datos
  await prisma.variantTextLine.deleteMany();
  await prisma.variantTypography.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.color.deleteMany();
  await prisma.figure.deleteMany();
  await prisma.baseType.deleteMany();
  await prisma.typography.deleteMany();

  // 2. Crear Categorías Reales
  console.log("Creando categorías...");
  const catAcrilicos = await prisma.category.create({ data: { name: 'Acrílicos' } });
  const catCristal = await prisma.category.create({ data: { name: 'Cristal' } });
  const catMadera = await prisma.category.create({ data: { name: 'Reconocimientos de Madera' } });
  const catCopas = await prisma.category.create({ data: { name: 'Copas y Trofeos' } });
  const catMedallas = await prisma.category.create({ data: { name: 'Medallas' } });

  // 3. Crear Colores, Figuras, Bases y Tipografías
  console.log("Creando catálogos de componentes...");
  
  const cDorado = await prisma.color.create({ data: { name: 'Dorado Brillante', hex: '#FFD700', stock: 150 } });
  const cPlateado = await prisma.color.create({ data: { name: 'Plateado Brillante', hex: '#E0E0E0', stock: 120 } });
  const cBronce = await prisma.color.create({ data: { name: 'Bronce Antiguo', hex: '#CD7F32', stock: 80 } });
  const cNegro = await prisma.color.create({ data: { name: 'Negro Mate', hex: '#2C2C2C', stock: 200 } });
  const cCristal = await prisma.color.create({ data: { name: 'Cristal Claro', hex: '#E8F2F8', stock: 100 } });

  const fCopa = await prisma.figure.create({ data: { name: 'Copa Clásica', stock: 60 } });
  const fEstrella = await prisma.figure.create({ data: { name: 'Estrella 3D', stock: 90 } });
  const fAbstracta = await prisma.figure.create({ data: { name: 'Llama Abstracta', stock: 45 } });

  const bMadera = await prisma.baseType.create({ data: { name: 'Madera de Pino', material: 'Madera', stock: 100 } });
  const bMarmol = await prisma.baseType.create({ data: { name: 'Mármol Negro', material: 'Mármol', stock: 80 } });
  const bCristal = await prisma.baseType.create({ data: { name: 'Cristal Biselado', material: 'Cristal', stock: 50 } });

  const tInter = await prisma.typography.create({ data: { name: 'Inter' } });
  const tRoboto = await prisma.typography.create({ data: { name: 'Roboto' } });
  const tMontserrat = await prisma.typography.create({ data: { name: 'Montserrat' } });

  // 4. Crear Producto de Ejemplo (Reconocimiento de Cristal)
  console.log("Creando productos...");

  const prodReconocimiento = await prisma.product.create({
    data: {
      name: 'Galardón Élite de Cristal',
      sku: 'GAL-ELI',
      description: 'Elegante galardón de cristal con acabados premium, ideal para reconocimientos corporativos de fin de año.',
      categoryId: catCristal.id
    }
  });

  // Vamos a crear 4 variantes para este producto:
  // Tamaños: 20cm, 25cm
  // Colores: Dorado, Plateado
  // Todo con: Figura Abstracta, Base de Cristal, Modalidad TEXT_LOGO
  const sizes = ['20cm', '25cm'];
  const colors = [cDorado, cPlateado];

  let variantCounter = 1;
  for (const size of sizes) {
    for (const color of colors) {
      const colorName = color.name.substring(0,3).toUpperCase();
      const variantSku = `GAL-ELI-${size}-${colorName}-ABS-CRI-TEXTL`.toUpperCase();
      const price = size === '20cm' ? 1200.00 : 1500.00; // precio depende del tamaño

      const variant = await prisma.productVariant.create({
        data: {
          productId: prodReconocimiento.id,
          size: size,
          colorId: color.id,
          figureId: fAbstracta.id,
          baseTypeId: bCristal.id,
          customizationType: 'TEXT_LOGO',
          sku: variantSku,
          price: price,
          isActive: true,
        }
      });

      // Añadir Configuración de Textos a esta Variante
      await prisma.variantTypography.createMany({
        data: [
          { variantId: variant.id, typographyId: tInter.id },
          { variantId: variant.id, typographyId: tMontserrat.id }
        ]
      });

      await prisma.variantTextLine.createMany({
        data: [
          { variantId: variant.id, label: 'Nombre de la Empresa', maxChars: 40 },
          { variantId: variant.id, label: 'Nombre del Galardonado', maxChars: 30 },
          { variantId: variant.id, label: 'Mensaje de Reconocimiento', maxChars: 100 },
        ]
      });

      variantCounter++;
    }
  }

  // 5. Crear Otro Producto (Copa Económica)
  const prodCopa = await prisma.product.create({
    data: {
      name: 'Copa Deportiva Estándar',
      sku: 'COP-EST',
      description: 'Copa metálica tradicional montada sobre base de madera.',
      categoryId: catCopas.id
    }
  });

  // Variantes: Único tamaño (Grande), 3 colores (Oro, Plata, Bronce), Sin personalizar
  const coloresCopa = [cDorado, cPlateado, cBronce];
  
  for (const color of coloresCopa) {
    const colorName = color.name.substring(0,3).toUpperCase();
    await prisma.productVariant.create({
      data: {
        productId: prodCopa.id,
        size: 'Grande',
        colorId: color.id,
        figureId: fCopa.id,
        baseTypeId: bMadera.id,
        customizationType: 'NONE', // No permite personalizar
        sku: `COP-EST-GDE-${colorName}-CPA-MAD-NONE`.toUpperCase(),
        price: 450.00,
        isActive: true,
      }
    });
  }

  console.log(`¡Seeding completado! Se crearon 2 productos con un total de ${variantCounter - 1 + 3} variantes.`);
}

main()
  .catch((e) => {
    console.error("Error durante el seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
