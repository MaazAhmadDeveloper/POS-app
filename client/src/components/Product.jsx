import React, { useState } from 'react'
import { Button, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

const Product = ({product}) => {
  const {cartItems} = useSelector(state => state.rootReducer);
  const dispatch = useDispatch();

  const handlerToCart = () => {
    const isProductExistInCart = cartItems.filter((obj) => obj._id.toString().includes(product?._id));

    if (isProductExistInCart.length === 0) {  
      dispatch({
        type: "ADD_TO_CART",
        payload: { ...product, quantity: 1 }
      })
    }
}

    const { Meta } = Card;

  return (
    <Card
        hoverable
        style={{ width: 240, marginBottom: 30, borderRadius: "10px"}}
        cover={<img alt={product.name} src={product.image} style={{height: 150, width: 230, margin: "auto", marginTop: "10px", borderRadius: "10px"}} />}
    >
        <Meta title={product.name} description={`Rs ${product.price}`} />
        <div className="product-btn">
          <Button onClick={() => handlerToCart()}>Add To Cart</Button>
        </div>
    </Card>
  )
}

export default Product
