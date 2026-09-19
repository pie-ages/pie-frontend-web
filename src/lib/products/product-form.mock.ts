import type { Product } from '@/types/products';
import type { ProductFormData, ProductFormValues } from '@/types/productForm';
import type { TaxonomyTerm } from '@/types/taxonomy';
import { MOCK_TAXONOMY } from '@/lib/taxonomy/taxonomy.mock';
import { MOCK_PRODUCTS } from './products.mock';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="800" height="1000" fill="%23f3f4f6"/></svg>'.replace(
      /%23/g,
      '#',
    ),
  );

function findTermId(terms: TaxonomyTerm[], name: string): string {
  return terms.find((term) => term.name.toLowerCase() === name.toLowerCase())?.id ?? '';
}

function buildFormValuesFromProduct(product: Product): ProductFormValues {
  return {
    name: product.name,
    description: '',
    price: product.price.toFixed(2).replace('.', ','),
    purchaseUrl: '',
    categoryId: findTermId(MOCK_TAXONOMY.categories, product.piece),
    colorId: findTermId(MOCK_TAXONOMY.colors, product.color),
    styleId: findTermId(MOCK_TAXONOMY.styles, product.style),
    sizeIds: product.sizes.map((s) => s.toLowerCase().replace(/\s/g, '')),
    images: [
      {
        id: `${product.id}-img-1`,
        url: PLACEHOLDER_IMAGE,
        name: `${product.id.toLowerCase()}-01.jpg`,
        isPrimary: true,
      },
    ],
    status: product.status,
  };
}

const SAVED_COUNTS: Record<string, number> = {
  'AN-1042': 412,
  'AN-1039': 287,
  'AN-1035': 193,
  'AN-1031': 54,
  'AN-1029': 318,
  'AN-1024': 76,
  'AN-1019': 521,
  'AN-1014': 0,
};

const GENERATED_PRODUCT_FORM_DETAILS: Record<string, ProductFormData> = Object.fromEntries(
  MOCK_PRODUCTS.map((product) => [
    product.id,
    {
      code: product.id,
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      savedCount: SAVED_COUNTS[product.id] ?? 0,
      values: buildFormValuesFromProduct(product),
    },
  ]),
);

export const MOCK_PRODUCT_FORM_DETAILS: Record<string, ProductFormData> = {
  ...GENERATED_PRODUCT_FORM_DETAILS,
  'AN-1042': {
    code: 'AN-1042',
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    savedCount: SAVED_COUNTS['AN-1042'],
    values: {
      name: 'Vestido Midi Verde',
      description:
        'Vestido midi com frente única e tiras em X nas costas, com aviamento verde. Tecido de toque seco, forro na saia.',
      price: '199,00',
      purchaseUrl: 'https://atelienove.com.br/vestido-midi-verde',
      categoryId: 'vestido',
      colorId: 'verde',
      styleId: 'romantico',
      sizeIds: ['p', 'm', 'g'],
      images: [
        {
          id: 'img-1042-1',
          url: PLACEHOLDER_IMAGE,
          name: 'vestido-verde-01.jpg',
          isPrimary: true,
        },
        {
          id: 'img-1042-2',
          url: PLACEHOLDER_IMAGE,
          name: 'vestido-verde-02.jpg',
          isPrimary: false,
        },
      ],
      status: 'PUBLISHED',
    },
  },
};
