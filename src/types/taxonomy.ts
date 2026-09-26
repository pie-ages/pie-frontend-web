export interface TaxonomyTerm {
  id: string;
  name: string;
}

export interface Taxonomy {
  categories: TaxonomyTerm[];
  colors: TaxonomyTerm[];
  styles: TaxonomyTerm[];
  sizes: TaxonomyTerm[];
  materials: TaxonomyTerm[];
}
