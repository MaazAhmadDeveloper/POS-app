import React, {useState, useEffect} from 'react'
import axios from 'axios'
import LayoutApp from '../../components/Layout'
import { Row, Col, message } from 'antd';
import Product from '../../components/Product';
import { useDispatch } from 'react-redux';
import HeaderInput from './HeaderInput';
import SlidingCatagories from './slidingCatagories';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [fullProductData, setFullProductData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [billsData, setBillsData] = useState([]);
  const [getBackupDataModal, setGetBackupDataModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => { 
    const getAllProducts = async () => {
        try {
          dispatch({
            type: "SHOW_LOADING",
          });
          const {data} = await axios.get('/api/products/getproducts');
          // console.log(data);
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
  
const getAllBills = async () => {
  try {
    const {data} = await axios.get('/api/bills/getbills');
    setBillsData(data);
    if (data.length === 0) {

      const getAllDataFromBackup = async ()=>{
        message.success("Data Coming from Cloud Server !")
        await axios.get('/api/userData/getdataBackup');
      };
      getAllDataFromBackup();
    }
  } catch(error) {
    console.log(error);
  }
};

useEffect(() => {
  // getAllBills();
}, []);

  useEffect(()=>{
    
    // const storage = localStorage.getItem('auth');
    // const parsedStorage = JSON.parse(storage);    

    // const initialDate = new Date(parsedStorage.createdAt);
    // const checkAndReassignValue = () => {
    //   console.log(parsedStorage);
        
    //   const currentDate = new Date();
    //   const timeElapsed = currentDate - initialDate;
    //   const reassignmentDuration = (parsedStorage.time * 30 * 24 * 60 * 60 * 1000);
    //   // const reassignmentDuration = (parsedStorage.time * 60 * 1000);
    
    //   if (timeElapsed >= reassignmentDuration) {
    //     localStorage.removeItem("auth");
    //     message.error("Your App is Out of dated");
    //     navigate("/login");
    //   };
    // };

    // checkAndReassignValue();

    setProductData(fullProductData.filter((obj) => (obj.name.toString().toLowerCase().includes(searchInput.toLowerCase() ))));

  },[searchInput])


  return (
    <LayoutApp  headerInput={<HeaderInput 
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  selectedCategory={selectedCategory}
                />}
                categories={<SlidingCatagories
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
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
