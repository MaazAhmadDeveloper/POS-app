import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Table } from 'antd';
import {BackwardOutlined} from '@ant-design/icons';
import axios from 'axios';

function SelectedCategory( {selectedCategory, setSelectedCategory} ) {
  const dispatch = useDispatch(); 
  const [productData, setProductData] = useState([]);

  const columns = [
    {
        title: "Name",
        dataIndex: "name"
    },
    {
        title: "Image",
        dataIndex: "image",
        render:(image, record) => <img src={image} alt={record.name} height={80} width={120} style={{borderRadius: 10}} />
    }, 
    {
        title: "Price",
        dataIndex: "price",
        render: ( prices, record ) => ( "Rs "+ prices ) 
    }
  ]

  const getAllProducts = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.get('/api/products/getproducts');
      setProductData(data.filter((obj) => (obj.category.includes(selectedCategory))));

      dispatch({
        type: "HIDE_LOADING",
      });

    } catch(error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
}, []);

  const backClickHandle = ()=>{
    setSelectedCategory(null);
  }

  return (
    <div>
      <button className='goBack-btn' onClick={backClickHandle}><BackwardOutlined style={{marginRight: 10}} /> Go Back</button>

      <h1 className='All-products-Categories-heading'>All products of {selectedCategory} </h1>
      <h1>Total {selectedCategory +": " + productData.length} </h1>

      <Table dataSource={productData} columns={columns} bordered />
    </div>
  )
}

export default SelectedCategory