import { Select, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import ReactToPrint from 'react-to-print';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout'
import Invoice from './Invoice';

const InvoicesRoute = () => {
    const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [fullBillsData, setFullBillsData] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Bill NO");

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
  }, []);

  useEffect(() => {

    switch (selectedCategory) {
      case "Bill NO":
        return setBillsData(fullBillsData.filter((obj) => (obj.billNumber.toString().includes(searchInputValue))));
        // return setBillsData(fullBillsData.filter((obj) => (obj.totalAmount.toString().toLowerCase().includes(searchInputValue.toLowerCase()))));
    
      case "Customer Name":
        return setBillsData(fullBillsData.filter((obj) => (obj.customerName.toString().toLowerCase().includes(searchInputValue.toLowerCase()))));
    
      case "Date":
        return setBillsData(fullBillsData.filter((obj) => (new Date(obj.createdAt).toLocaleDateString('en-GB').includes(searchInputValue.toLowerCase()))));
    
      case "Contact Number":
        return setBillsData(fullBillsData.filter((obj) => (obj.customerPhone.toString().includes(searchInputValue))));
    
      case "Customer Address":
        return setBillsData(fullBillsData.filter((obj) => (obj.customerAddress.toString().toLowerCase().includes(searchInputValue.toLowerCase()))));
    
      case "Total Amount":
        return setBillsData(fullBillsData.filter((obj) => (obj.totalAmount.toString().includes(searchInputValue))));
    
      default:
        return;
    }
}, [searchInputValue]);

  const columns = [
    {
      title: "Bill N0.",
      dataIndex: "billNumber"
    },
    {
        title: "Date",
        dataIndex: "createdAt",
        render: ( date ) => new Date(date).toLocaleDateString('en-GB')
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
        title: "Discount",
        dataIndex: "discount",
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
          <EyeOutlined className='cart-edit eye' onClick={() => {setSelectedBill(record); setPopModal(true);}} />
        </div>
        
    }
  ]

  return (
    <Layout>
        <h2 style={{margin: 0}} >All Invoice </h2>
        <div className="searchInput">
            <input 
              className='searchInputProduct' 
              type="text" 
              onChange={ e => setSearchInputValue(e.target.value) }
              value={searchInputValue}
              placeholder= {selectedCategory === "Date" ? "DD/MM/YYYY" :  'Search Invoice' }
              />
                <Select
                  placeholder="Search Via"
                  defaultValue="Bill No."
                  style={{ width: 200, marginLeft: 100 }}
                  onChange={(value) => setSelectedCategory(value)}
                >
                <Select.Option value="Bill NO">Bill N0.</Select.Option>
                <Select.Option value="Customer Name">Customer Name</Select.Option>
                <Select.Option value="Date">Date</Select.Option>
                <Select.Option value="Contact Number">Contact Number</Select.Option>
                <Select.Option value="Customer Address">Customer Address</Select.Option>
                <Select.Option value="Total Amount">Total Amount</Select.Option>
              </Select>
      </div>
      <Table dataSource={billsData} columns={columns} bordered />
      
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

export default InvoicesRoute
