import { Product, ProductCategory } from '../../types';

export interface ProductFilterParams {
  category?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sellerId?: string;
  locationArea?: string;
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export interface IProductRepository {
  getCategories(): Promise<ProductCategory[]>;
  getProducts(params?: ProductFilterParams): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductsBySeller(sellerId: string): Promise<Product[]>;
  addProduct(product: Omit<Product, 'id'>): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  toggleProductStock(id: string, isAvailable: boolean): Promise<boolean>;
}
