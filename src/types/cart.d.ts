
export class Cart {
  id: string;
  userId: string;
  cartItems: CartItem[];
}


export class CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}
