export interface TaxonomyTerm {
  id: string;
  name: string;
}

export interface Taxonomy {
  categories: TaxonomyTerm[];
  colors: TaxonomyTerm[];
  materials: TaxonomyTerm[];
  styles: TaxonomyTerm[];
}
