import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux';
import LayoutApp from '../../components/Layout'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Table, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

const Products = () => {

  const dispatch = useDispatch(); 
  const [productData, setProductData] = useState([]);
  const [fullproductData, setFullProductData] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const getAllProducts = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.get('/api/products/getproducts');
      setFullProductData(data)
      setProductData(data);

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
  useEffect(() => {

  setProductData(fullproductData.filter((obj) => (obj.name.toString().toLowerCase().includes(searchInputValue.toLowerCase() ))));

  }, [searchInputValue]);

  const handlerDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post('/api/products/deleteproducts', {productId:record._id});
      message.success("Product Deleted Successfully!")
      getAllProducts();
      setPopModal(false);
      dispatch({
        type: "HIDE_LOADING",
      });
      

    } catch(error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      message.error("Error!")
      console.log(error);
    }
  }

  const columns = [
    {
        title: "Name",
        dataIndex: "name"
    },
    {
        title: "Image",
        dataIndex: "image",
        render:(image, record) => <img src={image} alt={record.name} height={60} width={60} />
    }, 
    {
        title: "Price",
        dataIndex: "price",
    },
    {
        title: "Action",
        dataIndex: "_id",
        render:(id, record) => 
        <div>
          <DeleteOutlined className='cart-action' onClick={() => handlerDelete(record)}/>
          <EditOutlined className='cart-edit' onClick={() => {setEditProduct(record); setPopModal(true)}} />
        </div>
        
    }
  ]

  const handlerSubmit = async (value) => {
    // console.log(value);
    if(editProduct === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        console.log(value);
        await axios.post('/api/products/addproducts', value);
        message.success("Product Added Successfully!")
        getAllProducts();
        setPopModal(false);
        dispatch({
          type: "HIDE_LOADING",
        });
        
      } catch(error) {
        dispatch({
          type: "HIDE_LOADING",
        });
        message.error("Error!")
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
       await axios.put('/api/products/updateproducts', {...value, productId:editProduct._id});
        message.success("Product Updated Successfully!")
        getAllProducts();

        setPopModal(false);
        dispatch({
          type: "HIDE_LOADING",
        });

        setEditProduct(null);
      } catch(error) {
        dispatch({
          type: "HIDE_LOADING",
        });
        message.error("Error!")
        console.log(error);
      }
    }
  }

  return (
    <LayoutApp>
      <div className="products-top">
      <h2 style={{margin:0}} >All Products </h2>
      <h2 style={{margin:0, marginLeft: "auto"} } >Total Products: {productData.length} </h2>
      </div>

      <div className="searchInput">
            <input 
              className='searchInputProduct' 
              type="text" 
              onChange={ e => setSearchInputValue(e.target.value) }
              value={searchInputValue}
              placeholder='Search Product' 
              />
            <Button className='add-new' style={{position:"absolute", right: 0, zIndex: "1000", top: 15 }} onClick={() => setPopModal(true)}>Add New</Button>
      </div>
        
      <Table dataSource={productData} columns={columns} bordered />
      
      {
        popModal && 
        <Modal title={`${editProduct !== null ? "Edit Product" : "Add New Product"}`} visible={popModal} onCancel={() => {setEditProduct(null); setPopModal(false);}} footer={false}>
          <Form layout='vertical' initialValues={editProduct} onFinish={handlerSubmit} >
            <FormItem name="name" label="Name">
              <Input/>
            </FormItem>
            <Form.Item name="category" label="Category">
              <Select >
                <Select.Option value="Catagory-1">Catagory-1</Select.Option>
                <Select.Option value="Catagory-2">Catagory-2</Select.Option>
                <Select.Option value="Catagory-3">Catagory-3</Select.Option>
              </Select>
            </Form.Item>
            <FormItem name="price" label="Price">
              <Input/>
            </FormItem>
            <FormItem name="image" label="Image URL">
              <Input/>
            </FormItem>
            <div className="form-btn-add">
              <Button htmlType='submit' className='add-new'>Add</Button>
            </div>
          </Form>
        </Modal>
      }

    </LayoutApp>
  )
}

export default Products
