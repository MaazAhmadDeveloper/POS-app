import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { DeleteOutlined, EditOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Card, message, Modal, Button} from 'antd';  


function Mappedcard( {productObj, getAllCategories, setEditProduct, setPopModal, getAllProducts, categoryClickHandle, setSecretModal, secretAllow} ) {
    const dispatch = useDispatch();
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [deleteModelPopUp, setDeleteModelPopUp] = useState(false);

    const handlerDelete = async (idCategory) => {
      setIsOptionsVisible(false)

      const productsIdArray = [];
        getAllProducts.filter(e => e.category.includes(productObj.category)).forEach(element => {
          productsIdArray.push(element._id);
        })

        try {
          dispatch({
            type: "SHOW_LOADING",
          });
          await Promise.all([
            axios.put('/api/categories/deleteCategories', { productId: idCategory }),
            axios.post('/api/products/deleteproducts', { productsIdArray:productsIdArray }),
          ]);
          message.success("Product Deleted Successfully!")
          getAllCategories();
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

      const handleEllipsisClick = () => {
        setIsOptionsVisible(!isOptionsVisible);
      };
      const ClickOnEditHandle = ()=>{
        if (secretAllow) {
          setIsOptionsVisible(false)
          setEditProduct(productObj);
          setPopModal(true)
        }else{
          setSecretModal(true);
        }
      }
      const clickDeleteHandle = ()=>{

      if (secretAllow) {
        setIsOptionsVisible(false)
        setDeleteModelPopUp(true)
      }else{
        setSecretModal(true);
      }
      }

  return (

    <Card
      hoverable
      style={{ width: 240, marginBottom: 30, borderRadius: "10px"}}
      cover={<img alt={productObj.category} src={productObj.image} onClick={() => categoryClickHandle(productObj.category)} style={{height: 150, width: 230, margin: "auto", marginTop: "10px", borderRadius: "10px"}} />}
  >

      <div onClick={() => categoryClickHandle(productObj.category)} style={{display: "flex"}} >

        <h1> {productObj.category.charAt(0).toUpperCase() + productObj.category.slice(1)} </h1>
        <div style={{marginLeft: "auto"}}>Products: {Array.isArray(getAllProducts) ? getAllProducts.filter(e => e.category.includes(productObj.category)).length : 0} </div>
      </div>

        <div style={{display: "flex", marginTop:20}}> 
          
          <div className={`twoButtonsContainer options-container ${isOptionsVisible ? 'visible' : 'hidden'}`}>
          <DeleteOutlined className='cart-action' onClick={isOptionsVisible && clickDeleteHandle }/>
           
           <EditOutlined className='cart-edit' onClick={isOptionsVisible && ClickOnEditHandle }/>
          </div>
          
          {isOptionsVisible ? <DoubleRightOutlined className='doubleArrow' onClick={handleEllipsisClick }  /> : <DoubleLeftOutlined  className='doubleArrow' onClick={handleEllipsisClick} />}
        </div>


        <Modal title="Delete Category" visible={deleteModelPopUp} onCancel={() => setDeleteModelPopUp(false) } footer={false}>
            <h3 style={{marginBottom: 50}}>Are you sure do delete this category and all products of this category</h3>
            <div style={{display: "flex"}}>
                <Button className='cancel-category' onClick={()=>{ setDeleteModelPopUp(false)}}>Cancel</Button>
                <Button className='delete-category' onClick={()=>{ handlerDelete(productObj._id,  ); setDeleteModelPopUp(false)  }}>Cofirm</Button>
            </div>
        </Modal>
  </Card>
  )
}

export default Mappedcard