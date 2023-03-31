import { useState } from 'react'
import { useQuery } from 'react-query'

//components
import { LinearProgress, Drawer, Grid, Badge } from '@material-ui/core';
import  AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Item from "./components/Item/Item";
import Cart from "./components/Cart/Cart";
//Styles
import { StyledButton, Wrapper } from "./App.styles";

//Types
export type CartItemType = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
  amount: number;
}

//<>: angel bracket
const getProducts = async (): Promise<CartItemType[]> => await (await fetch("https://fakestoreapi.com/products")).json(); //convert data into json() because its async too

const App = () => {
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const [cartOpen, setCartOpen] = useState(false);

  const { data, isLoading, error } = useQuery<CartItemType[]>('products', getProducts); //products is key

  const getTotalItem = (items: CartItemType[]) => items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      //1. is the item already added in the cart ?
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if(isItemInCart) {
        return prev.map(item => (
          item.id === clickedItem.id ? { ...item, amount: item.amount + 1 } : item
        ))
      }
      //first time the item is added
      return [...prev, { ...clickedItem, amount: 1 }]
    })
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => (
      prev.reduce((ack, item) => {
        if(item.id === id) {
          if(item.amount === 1) return ack;
          return [...ack, {...item, amount: item.amount - 1}];
        } return [...ack, item];
      }, [] as CartItemType[])
    ))
  };

  if (isLoading) return <LinearProgress />
  if (error) return <div>"Something went wrong..."</div>
  // "?." return undefined if cannot get data from api
  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart cartItems={cartItems} 
        addToCart={handleAddToCart} 
        removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge  overlap="rectangular" badgeContent={getTotalItem(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  )
}

export default App
