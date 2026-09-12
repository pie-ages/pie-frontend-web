import type { Product } from '@/types/products';
import type { ProductFormValues } from '@/types/productForm';
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

export const EMPTY_PRODUCT_FORM_VALUES: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  purchaseUrl: '',
  categoryId: '',
  colorId: '',
  materialId: '',
  styleIds: [],
  images: [],
  status: 'RASCUNHO',
};

interface MockProductFormRecord {
  code: string;
  values: ProductFormValues;
}

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
    materialId: MOCK_TAXONOMY.materials[0]?.id ?? '',
    styleIds: [findTermId(MOCK_TAXONOMY.styles, product.style)].filter(Boolean),
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

const GENERATED_PRODUCT_FORM_DETAILS: Record<string, MockProductFormRecord> = Object.fromEntries(
  MOCK_PRODUCTS.map((product) => [
    product.id,
    { code: product.id, values: buildFormValuesFromProduct(product) },
  ]),
);

export const MOCK_PRODUCT_FORM_DETAILS: Record<string, MockProductFormRecord> = {
  ...GENERATED_PRODUCT_FORM_DETAILS,
  'AN-1042': {
    code: 'AN-1042',
    values: {
      name: 'Vestido Midi Verde',
      description:
        'Vestido midi com frente única e tiras em X nas costas, com aviamento verde. Tecido de toque seco, forro na saia.',
      price: '199,00',
      purchaseUrl: 'https://atelienove.com.br/vestido-midi-verde',
      categoryId: 'vestido',
      colorId: 'verde',
      materialId: 'algodao',
      styleIds: ['romantico'],
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
      status: 'PUBLICADO',
    },
  },
};
