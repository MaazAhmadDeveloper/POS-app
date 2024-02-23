import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux';
import LayoutApp from '../../components/Layout'
import { DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Table, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

const Products = () => {

  const dispatch = useDispatch(); 
  const [productData, setProductData] = useState([]);
  const [fullproductData, setFullProductData] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState([]); 
  const [allCategories, setAllCategories] = useState([]); 
  const [popModal, setPopModal] = useState(false);
  const [secretModal, setSecretModal] = useState(false);
  const [secretAllow, setSecretAllow] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState();
  const [secretInputValue, setSecretInputValue] = useState();
  const [editProduct, setEditProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getAllProducts = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.get('/api/products/getproducts');
      setFullProductData(data)
      setProductData(data);
      // console.log(data);

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
  const getAllCategories = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.get('/api/categories/getCategories');
      setAllCategories(data);
      // console.log(data);
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
      getAllCategories();
  }, []);

  useEffect(() => {
  setProductData(fullproductData.filter((obj) => (obj.name.toString().toLowerCase().includes(searchInputValue.toLowerCase() ))));
  
}, [searchInputValue]);

  useEffect(() => {
  setProductData(selectedCategory === "all" ? fullproductData : fullproductData.filter((obj) => (obj.category.includes(selectedCategory))));

  }, [selectedCategory]);

  const handlerDelete = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post('/api/products/deleteproducts', {productId:recordToDelete._id});
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
  const editProductHandle =(record)=>{
    console.log(record);
    setEditProduct(record);
     setPopModal(true)
  }
  const deleteProductHandle =(record)=>{
    setRecordToDelete(record);
    setDeleteModel(true);
  }

  const columns = [
    {
        title: "Name",
        dataIndex: "name"
    },
    {
        title: "Image",
        dataIndex: "image",
        render:(image, record) => <img src={image} alt={record.name} height={50} width={90} style={{borderRadius: 10}} />
    }, 
    {
      title: "Category",
      dataIndex: "category",
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
          <DeleteOutlined className='cart-action' onClick={() => secretAllow ? deleteProductHandle(record) : setSecretModal(true)}/>
          <EditOutlined className='cart-edit' onClick={() => secretAllow ?  editProductHandle(record): setSecretModal(true)} />
        </div>
        
    }
  ]

  const handlerSubmit = async (value) => {

    for (let key in value) {
      if (value[key] === null || value[key] === undefined) {
        return message.error("Full fill the form");
      }
    }

    if(editProduct === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        // console.log(value);
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

  const secretConfirmHandle = ()=>{
    console.log("confirmed");
    if (secretInputValue.toString() === "m@@X") {
      setSecretAllow(true);
      message.success("Your Product Sections Unlocked");
      setSecretInputValue("");
      setSecretModal(false);
    }else{
      setSecretModal(false);
      message.error("Your secret key is incorrect");
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

              <Select 
              onChange={(value) => setSelectedCategory(value)}
              defaultValue="all"
              style={{ width: "200px", marginLeft: "20px"}}
               >
                <Select.Option value="all" > All </Select.Option>
                {allCategories.map(categoryObj => (
                <Select.Option value={categoryObj.category}>{categoryObj.category}</Select.Option>
                ))}
              </Select>

              {secretAllow ? <UnlockOutlined style={{marginLeft: "100px"}} onClick={ ()=> {setSecretAllow(false); setSecretInputValue("")} } />: <LockOutlined style={{marginLeft: "100px"}} onClick={ ()=> setSecretModal(true) } /> }
              
            <Button className='add-new' style={{position:"absolute", right: -50, zIndex: "1000", top: 15 }} onClick={() => secretAllow ? setPopModal(true): setSecretModal(true)}>Add New</Button>
      </div>
      <Table dataSource={productData} columns={columns} bordered />
      
      {
        popModal && 
        <Modal title={`${editProduct !== null ? "Edit Product" : "Add New Product"}`} visible={popModal} onCancel={() => {setEditProduct(null); setPopModal(false);}} footer={false}>
          <Form layout='vertical' initialValues={editProduct} onFinish={handlerSubmit} >
            <FormItem name="name" label="Name">
              <Input/>
            </FormItem>
            <FormItem name="category" label="Category">
              <Select 
                style={{ width: "100%"}}
              >

                {allCategories.map(categoryObj => (

                <Select.Option value={categoryObj.category}>{categoryObj.category}</Select.Option>

                ))}

              </Select>
            </FormItem>
            <FormItem name="price" label="Price">
              <Input/>
            </FormItem>
            <FormItem name="image" label="Image URL">
              <Input/>
            </FormItem>
            <div className="form-btn-add">
              <Button htmlType='submit' className='add-new' >Add</Button>
            </div>
          </Form>
        </Modal>
      }

      <Modal title={"Secret Key "} visible={secretModal} onCancel={() => {setSecretModal(false); setSecretInputValue("")}} footer={false}>
        <h3 >Enter Secret Key here</h3>
        <input 
          type="password" 
          className='secret-key-input' 
          placeholder='Secret Key' 
          style={{marginBottom: 50}}
          onChange={ (e) => setSecretInputValue(e.target.value) }
          value={secretInputValue}
          />
            <div style={{display: "flex"}}>
                <Button className='cancel-category' onClick={()=>{ setSecretModal(false); setSecretInputValue("") }}>Cancel</Button>
                <Button className='delete-category' onClick={secretConfirmHandle}>Cofirm</Button>
            </div>
      </Modal>

      <Modal title={"Delete Product "} visible={deleteModel} onCancel={() => {setDeleteModel(false)}} footer={false}>
        <h3 >Are you sure to delete this product</h3>
        <div style={{display: "flex"}}>
                <Button className='cancel-category' onClick={()=>{ {setDeleteModel(false)} }}>Cancel</Button>
                <Button className='delete-category' onClick={()=> { handlerDelete(); setDeleteModel(false)} }>Cofirm</Button>
            </div>
      </Modal>

    </LayoutApp>
  )
}

export default Products
