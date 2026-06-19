"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- COLORS ---
export async function createColor(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const hex = formData.get("hex") as string;
    const stock = Number(formData.get("stock")) || 100;
    const imageUrl = (formData.get("imageUrl") as string) || null;
    await prisma.color.create({ data: { name, hex, stock, imageUrl } });
    revalidatePath("/admin/catalogos/colores");
  } catch (error) {
    console.error(error);
  }
}

export async function updateColorStock(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const stock = Number(formData.get("stock"));
    await prisma.color.update({ where: { id }, data: { stock } });
    revalidatePath("/admin/catalogos/colores");
  } catch (error) {
    console.error(error);
  }
}

export async function deleteColor(id: string) {
  try {
    await prisma.color.delete({ where: { id } });
    revalidatePath("/admin/catalogos/colores");
  } catch (error) {
    console.error(error);
  }
}

// --- TYPOGRAPHIES ---
export async function createTypography(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData.get("name") as string;
    const fontUrl = (formData.get("fontUrl") as string) || null;
    await prisma.typography.create({ data: { name, fontUrl } });
    revalidatePath("/admin/catalogos/tipografias");
    return { success: true };
  } catch (error: any) {
    console.error("createTypography error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTypography(id: string) {
  try {
    await prisma.typography.delete({ where: { id } });
    revalidatePath("/admin/catalogos/tipografias");
  } catch (error) {
    console.error(error);
  }
}

// --- FIGURES ---
export async function createFigure(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const imageUrl = (formData.get("imageUrl") as string) || null;
    const stock = Number(formData.get("stock")) || 100;
    await prisma.figure.create({ data: { name, imageUrl, stock } });
    revalidatePath("/admin/catalogos/figuras");
  } catch (error) {
    console.error(error);
  }
}

export async function updateFigureStock(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const stock = Number(formData.get("stock"));
    await prisma.figure.update({ where: { id }, data: { stock } });
    revalidatePath("/admin/catalogos/figuras");
  } catch (error) {
    console.error(error);
  }
}

export async function deleteFigure(id: string) {
  try {
    await prisma.figure.delete({ where: { id } });
    revalidatePath("/admin/catalogos/figuras");
  } catch (error) {
    console.error(error);
  }
}

// --- BASE TYPES ---
export async function createBaseType(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const material = (formData.get("material") as string) || null;
    const imageUrl = (formData.get("imageUrl") as string) || null;
    const stock = Number(formData.get("stock")) || 100;
    await prisma.baseType.create({ data: { name, material, imageUrl, stock } });
    revalidatePath("/admin/catalogos/bases");
  } catch (error) {
    console.error(error);
  }
}

export async function updateBaseTypeStock(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const stock = Number(formData.get("stock"));
    await prisma.baseType.update({ where: { id }, data: { stock } });
    revalidatePath("/admin/catalogos/bases");
  } catch (error) {
    console.error(error);
  }
}

export async function deleteBaseType(id: string) {
  try {
    await prisma.baseType.delete({ where: { id } });
    revalidatePath("/admin/catalogos/bases");
  } catch (error) {
    console.error(error);
  }
}

// --- CATEGORIES ---
export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    await prisma.category.create({ data: { name } });
    revalidatePath("/admin/catalogos/categorias");
  } catch (error) {
    console.error(error);
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/catalogos/categorias");
  } catch (error) {
    console.error(error);
  }
}
