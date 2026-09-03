'use client'

import { use } from 'react'
import ProductForm from '@/components/admin/forms/ProductForm'

export default function ProductFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <ProductForm id={id} backHref="/admin/products" />
}