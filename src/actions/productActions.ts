"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/actions/uploadActions";

export async function uploadVariantImage(formData: FormData) {
  return uploadImage(formData, "variantes");
}


export async function saveWizardVariants(payload: any) {
  try {
    let productId = "";

    if (payload.isNewProduct) {
      const newProd = await prisma.product.create({
        data: {
          name: payload.productData.name,
          sku: payload.productData.sku,
          description: payload.productData.description || null,
          categoryId: payload.productData.categoryId || null,
        }
      });
      productId = newProd.id;
    } else {
      productId = payload.productData.id;
    }

    // Cada variante en generatedVariants ya trae sus propios size/colorId/figureId/baseTypeId
    for (const v of payload.generatedVariants) {
      const createdVariant = await prisma.productVariant.create({
        data: {
          productId,
          size: v.size,
          colorId: v.colorId,
          figureId: v.figureId,
          baseTypeId: v.baseTypeId,
          customizationType: v.customizationType,
          sku: v.sku,
          price: Number(v.price) || 0,
          imageUrl: v.imageUrl || null,
          isActive: true,
        }
      });

      const needsText = v.customizationType === "TEXT_LOGO" || v.customizationType === "TEXT_ONLY";
      if (payload.textConfig && needsText) {
        if (payload.textConfig.typographies?.length > 0) {
          await prisma.variantTypography.createMany({
            data: payload.textConfig.typographies.map((tId: string) => ({
              variantId: createdVariant.id,
              typographyId: tId
            }))
          });
        }
        if (payload.textConfig.textLines?.length > 0) {
          await prisma.variantTextLine.createMany({
            data: payload.textConfig.textLines.map((line: any) => ({
              variantId: createdVariant.id,
              label: line.label,
              maxChars: Number(line.maxChars) || 30
            }))
          });
        }
      }
    }

    revalidatePath("/admin/productos");
    return { success: true };

  } catch (error: any) {
    console.error("Error saving wizard variants:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleVariantActive(variantId: string, isActive: boolean) {
  try {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { isActive }
    });
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateVariantPrice(variantId: string, price: number) {
  try {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { price }
    });
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function saveVariantLogoArea(variantId: string, area: string | null) {
  try {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { logoArea: area }
    });
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateProduct(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const description = (formData.get("description") as string) || null;
    const categoryId = (formData.get("categoryId") as string) || null;

    await prisma.product.update({
      where: { id },
      data: { name, sku, description, categoryId }
    });
    revalidatePath(`/admin/productos/${id}`);
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function saveVariantTextConfig(payload: any) {
  try {
    const { variantId, textLines, typographies } = payload;
    
    // 1. Delete existing typographies and textlines
    await prisma.variantTypography.deleteMany({ where: { variantId } });
    await prisma.variantTextLine.deleteMany({ where: { variantId } });

    // 2. Insert new ones
    if (typographies?.length > 0) {
      await prisma.variantTypography.createMany({
        data: typographies.map((tId: string) => ({ variantId, typographyId: tId }))
      });
    }

    if (textLines?.length > 0) {
      await prisma.variantTextLine.createMany({
        data: textLines.map((line: any) => ({
          variantId,
          label: line.label,
          maxChars: Number(line.maxChars) || 30
        }))
      });
    }

    revalidatePath("/admin/productos");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateVariantImage(variantId: string, imageUrl: string | null) {
  try {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { imageUrl }
    });
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteVariant(variantId: string) {
  try {
    await prisma.productVariant.delete({ where: { id: variantId } });
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
