import { Table, Select, Button } from 'antd';
import { usePDF } from 'react-to-pdf';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { EyeOutlined } from '@ant-design/icons';
import Layout from '../../components/Layout'
import Invoice from '../invoices/Invoice';

const Reports = () => {
  const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [fullBillsData, setFullBillsData] = useState([]);
  const [slectedBills, setSlectedBills] = useState();
  const [productData, setProductData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  

  const getAllProducts = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.get('/api/products/getproducts');
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

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.get('/api/bills/getbills');
      setBillsData(data);
      setFullBillsData(data);
      console.log(data);
      dispatch({
        type: "HIDE_LOADING",
      });
      // console.log(data);

    } catch(error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      console.log(error);
    }
  };

  useEffect(() => {
      getAllBills();
      getAllProducts();
  }, []);

  const columns = [
    {
      title: "Bill N0.",
      dataIndex: "billNumber"
    },
    {
        title: "Date",
        dataIndex: "createdAt",
        render: ( date ) => date.toString().substring(0, 10)
    },
    {
        title: "Customer Name",
        dataIndex: "customerName",
    }, 
    {
        title: "Contact Number",
        dataIndex: "customerPhone",
    }
    , 
    {
        title: "Customer Address",
        dataIndex: "customerAddress",
    },
    {
        title: "Sub Total",
        dataIndex: "subTotal",
    },
    {
        title: "Tax",
        dataIndex: "tax",
    },
    {
        title: "Total Amount",
        dataIndex: "totalAmount",
    },
    {
        title: "Action",
        dataIndex: "_id",
        render:(id, record) => 
        <div>
          <EyeOutlined className='cart-edit eye' onClick={() => {setSelectedBill(record); setPopModal(true); console.log(record);}} />
        </div>
        
    }
  ]

  const uniqueNamesSet = new Set();

  useEffect(()=>{

   if (slectedBills?.type === "date") {
    setBillsData(fullBillsData?.filter( obj => {return  obj.createdAt.toString().substring(0, 10) >= slectedBills?.formattedDate  && obj.createdAt.toString().substring(0, 10) <= new Date().toISOString().split('T')[0]}));

    }else if(slectedBills?.type === "product"){

      setBillsData(fullBillsData
          .flatMap( mainObj => mainObj.cartItems
            .filter( value => value.name.includes(slectedBills.value))
              .map( () => (mainObj ))));

    }else if (slectedBills?.type === "customers") {
      setBillsData(fullBillsData.filter((obj) => obj.customerName.includes(slectedBills.value)));

    }

  },[slectedBills]);

  function getFormattedDate(daysAgo) {
    
      const currentDate = new Date();
      const targetDate = new Date(currentDate);
      targetDate.setDate(currentDate.getDate() - daysAgo);
    
      const formattedDate = targetDate.toISOString().split('T')[0];
      setSlectedBills({
        type:"date",
        formattedDate
      });
    
  }

  return (
    <Layout>

      <div style={{position: "relative"}}>
        <h2>Reports</h2>
        {/* onClick={() => setPopModal(true)} */}
        <Button className='add-new' onClick={() => toPDF()} style={{position:"absolute", right: 10, zIndex: "1000", top: 55 }} >Download</Button>
      </div>

      <div className="report-select-div">
                <Select
                  placeholder="Date"
                  style={{ width: 200, marginRight: 100 }}
                  allowClear={true}
                  onChange={(value) => value === undefined? setBillsData(fullBillsData) :getFormattedDate(Number(value))}
                >
                <Select.Option value="1">Last 1 Day</Select.Option>
                <Select.Option value="7">Last 7 Days</Select.Option>
                <Select.Option value="30">Last 30 Days</Select.Option>
              </Select>

                <Select
                  placeholder="Products"
                  style={{ width: 200, marginRight: 100 }}
                  allowClear={true}
                  onChange={(value) => value === undefined? setBillsData(fullBillsData) :  setSlectedBills({
                    type:"product",
                    value
                  })}
                >
                {productData.map(product => (
                    <Select.Option value={product.name}>{product.name}</Select.Option>
                  ))}
              </Select>

                <Select
                  placeholder="Customers"
                  style={{ width: 200, marginRight: 100 }}
                  allowClear={true}
                  onChange={(value) => value === undefined? setBillsData(fullBillsData) :setSlectedBills({
                    type:"customers",
                    value
                  })}
                >
                {fullBillsData.map(customer => {
                    if (customer.customerName !== "(Unknown)" && !uniqueNamesSet.has(customer.customerName)) {
                        uniqueNamesSet.add(customer.customerName);
                return (
                    <Select.Option key={customer.customerName} value={customer.customerName}>
                      {customer.customerName}
                    </Select.Option>
                  );
                }
                return null;
                })}

              </Select>
      </div>


      <Table dataSource={billsData} columns={columns} bordered ref={targetRef} pagination={false} size="small" />

      { 
        popModal 
          && <Invoice 
          selectedBill={selectedBill}
          popModal={popModal}
          setPopModal={setPopModal}
            /> 
          }
    </Layout>
  )
}

export default Reports
