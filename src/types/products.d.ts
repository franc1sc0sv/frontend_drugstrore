
type ItemConnection  ={
  edges: ItemEdgeDto[];
  pageInfo: PageInfo;
}

export class ItemEdge {
  node: Product;
  cursor: string;
}

export class PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

type Product ={
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isDisabled: boolean;
  lowStockNotified: boolean;
  categoryId: string;
  category?: Category;
  images?: ProductImage[];
  createdAt: Date;  
  updatedAt: Date;
}

export class ProductImage {
  id: string;
  url: string;
  productId: string;
  cloudinaryPublicId: string;
}



export class Category {

  id: string;
  name: string;
  description: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;  
  parent?: Category;
  subCategories?: Category[];
}
