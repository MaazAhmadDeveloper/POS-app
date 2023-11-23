import React, {useState, useEffect} from 'react'
import axios from 'axios'
import LayoutApp from '../../components/Layout'
import { Row, Col } from 'antd';
import Product from '../../components/Product';
import { useDispatch } from 'react-redux';
import Catagories from './Catagories';

const Home = () => {

  const dispatch = useDispatch();

  const [fullProductData, setFullProductData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const getAllProducts = async () => {
        try {
          dispatch({
            type: "SHOW_LOADING",
          });
          const {data} = await axios.get('/api/products/getproducts');
          console.log(data);
          setFullProductData(data);
          setProductData(data) 

          dispatch({
            type: "HIDE_LOADING",
          });
          // console.log(data);

        } catch(error) {
          console.log(error);
        }
      };

      getAllProducts();
  }, [dispatch]);
  

  useEffect(()=>{

    setProductData(fullProductData.filter((obj) => (obj.name.toString().toLowerCase().includes(searchInput.toLowerCase() ))));

  },[searchInput])


  return (
    <LayoutApp  categories={<Catagories
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setSearchInput={setSearchInput}
                searchInput={searchInput}
                />}
    >
      <Row>
        {
          selectedCategory === "All" ?
          productData.map((product) => (
            <Col xs={24} sm={6} md={12} lg={6}>
              <Product key={product.id} product={product} />
            </Col>
          ))
          :
          productData.filter((i) => i.category === selectedCategory).map((product) => (
          <Col xs={24} sm={6} md={12} lg={6}>
            <Product key={product.id} product={product} />
          </Col>
        ))}
      </Row>
    </LayoutApp>
  )
}

export default Home
