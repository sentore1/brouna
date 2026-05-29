import { Metadata } from 'next'
import { supabase } from '../../../lib/supabase'
import { generateProductMetadata, generateProductJsonLd } from '../../../lib/seo'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: products } = await supabase.from('products').select('*')
  const product = products?.find((p: any) => p.slug === params.id || p.id === params.id)
  
  if (!product) {
    return {
      title: 'Product Not Found | SIZA',
      description: 'The product you are looking for could not be found.',
    }
  }
  
  return generateProductMetadata(product)
}
