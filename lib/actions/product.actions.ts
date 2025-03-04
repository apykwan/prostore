'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { prisma } from '@/db/prisma';
import { getUTApi } from '@/server/uploadthing';
import { convertToPlainObject, formatError } from '@/lib/utils';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '@/lib/constants';
import { insertProductSchema, updateProductSchema } from '@/lib/validators';

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' }
  });

  return convertToPlainObject(data);
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug }
  });
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  const productQuery = {
    orderBy: { createdAt: "desc" as "asc" | "desc" },
    skip: (page - 1) * limit,
    take: limit,
    where: {} 
  };

  if (query !== 'all') {
    productQuery.where = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } }
      ]
    };
  }

  const data = await prisma.product.findMany(productQuery);
  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit)
  };
}

export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId }
  });

  return convertToPlainObject(data);
}

export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id }
    });

    if (!productExists) throw new Error('Product not found');

    // Extract file keys from stored URLs
    const fileKeys = productExists.images.map(img => img.split('/').pop());

    // Delete all the uploaded images and banner from uploadthing
    if (fileKeys.length > 0) {
      if (productExists.banner) {
        fileKeys.push(productExists.banner.split('/').pop());
      }

      const utapiInstance = getUTApi();
      await utapiInstance.deleteFiles(fileKeys as string[]);
    }

    await prisma.product.delete({ where: { id } });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}

// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists  = await prisma.product.findFirst({
      where: { id: product.id }
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.update({
      where: { id: product.id },
      data: product
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product updated successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}

// Get all categories
export async function getAllCategories() {
  return await prisma.product.groupBy({
    by: ['category'],
    _count: true
  });
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4
  });

  return convertToPlainObject(data);
}