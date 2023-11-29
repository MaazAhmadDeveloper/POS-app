import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import Mappedcard from './Mappedcard';
import LayoutApp from '../../components/Layout';
import { Row, Col, Button, Form, Input, Modal, Select, Table, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import SelectedCategory from './SelectedCategory';


function Categories(  ) {
  const [fullProductData, setFullProductData] = useState([]);
  const [getAllProducts, setGetAllProducts] = useState('All');
  const [popModal, setPopModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const dispatch = useDispatch();

  const getAllCategories = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.get('/api/categories/getCategories');
      setFullProductData(data);
      // console.log(data);

      dispatch({
        type: "HIDE_LOADING",
      });
    } catch(error) {
      console.log(error);
    }
  };
  const getProductFunc = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.get('/api/products/getproducts');
      setGetAllProducts(data);
      console.log(data);

      dispatch({
        type: "HIDE_LOADING",
      });
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    getAllCategories();
    getProductFunc();
  },[]);

  const handlerSubmit = async (value) => {
    // console.log(value);
    if(editProduct === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });

        await axios.post('/api/categories/addCategories', value);
        message.success("Product Added Successfully!")
        getAllCategories();
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
       await axios.put('/api/categories/updateCategories', {...value, productId:editProduct._id});
        message.success("Product Updated Successfully!")
        getAllCategories();

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
    <LayoutApp >
      
      <div >
        
      <div className="products-top">
      <h2 style={{margin:0}} >All Caregories </h2>
      <Button className='add-new' style={{position:"absolute", right: 0, zIndex: "1000", }}  onClick={() => setPopModal(true)}>Add New</Button>
      </div>
      <h3>Total Products: { getAllProducts.length } </h3>

  <div style={{marginTop: 30}}>
      <Row>
      {fullProductData.map((productObj)=> 
                    <Col xs={24} sm={6} md={12} lg={6}>
                    <Mappedcard 
                      key={productObj.id} 
                      productObj={productObj} 
                      getAllCategories={getAllCategories}
                      setEditProduct={setEditProduct}
                      setPopModal={setPopModal}
                      getAllProducts={getAllProducts}
                      />
                  </Col>
      )}
      </Row>
  </div>

  {
        popModal && 
        <Modal title={`${editProduct !== null ? "Edit Product" : "Add New Product"}`} visible={popModal} onCancel={() => {setEditProduct(null); setPopModal(false);}} footer={false}>
          <Form layout='vertical' initialValues={editProduct} onFinish={handlerSubmit} >
            <FormItem name="category" label="categories">
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
      </div>

    </LayoutApp>
  )
}

export default Categories 