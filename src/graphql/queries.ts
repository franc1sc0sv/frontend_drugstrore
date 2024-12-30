import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($first: Int, $after: String) {
    getProducts(getProductsInput: { first: $first, after: $after }) {
      edges {
        node {
          id
          name
          price
          description
          images {
            url
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
    }
  }
`;


export const GET_CART = gql`
  query GetCart {
    getCart {
      id
      cartItems {
        id
        quantity
        product {
          id
          name
          price
          description
          images {
            url
          }
        }
      }
    }
  }
`;


export const ADD_ITEM_TO_CART = gql`
  mutation AddItemToCart($input: AddItemToCartInput!) {
    addItemToCart(addItemToCartInput: $input) {
      id
      cartItems {
        id
        quantity
        product {
          id
          name
          price
          description
          images {
            url
          }
        }
      }
    }
  }
`;


export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($cartItemIdDto: IdDto!) {
    removeCartItem(cartItemIdDto: $cartItemIdDto)
  }
`;


export const CALCULATE_TOTAL = gql`
  mutation CalculateTotal {
    calculateTotal {
      total
    }
  }
`;


export const CREATE_ORDER = gql`
  mutation CreateOrder {
    createOrder {
      client_secret
      order {
        id
      }
    }
  }
`;

export const GET_ORDER_BY_ID_QUERY = gql`
  query getOrderById($orderIdDto: IdDto!) {
    getOrderById(orderIdDto: $orderIdDto) {
      id
      orderStatus
      total
      createdAt
      userId
      payments {
        stripeClientSecret
      }
      orderItems {
        id
        product {
          name
          price
        }
        quantity
      }
    }
  }
`;
