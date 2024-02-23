import { Table, Select, Button, Modal, message } from 'antd';
import { usePDF } from 'react-to-pdf';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { EyeOutlined, UploadOutlined, DownloadOutlined, CloudUploadOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import Layout from '../../components/Layout'
import Invoice from '../invoices/Invoice';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const { toPDF, targetRef } = usePDF({filename: 'page.pdf',});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [fullBillsData, setFullBillsData] = useState([]);
  const [slectedBills, setSlectedBills] = useState();
  const [productData, setProductData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
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

      // if (fullBillsData.length === 0) {
      //   const getAllDataFromBackup = async ()=>{
      //     await axios.get('/api/userData/getdataBackup');
      //   };
      //   getAllDataFromBackup();
      // }
  }, []);

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
          <EyeOutlined className='cart-edit eye' onClick={() => {setSelectedBill(record); setPopModal(true); console.log(record);}} />
        </div>
        
    }
  ]
  const columnsForDownload = [
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

  const uploadHandler = async ()=>{
    message.error("Sorry this POS app is already live, you can only use upload feature if this app was in you local server!");
    // const storage = localStorage.getItem('auth'); 
    // const parsedStorage = JSON.parse(storage);

    // try {
    //   dispatch({
      //     type: "SHOW_LOADING",
      //   });
      // message.success("Wait for Backup !");
    //     const response = await axios.post("/api/userData/dataBackup", parsedStorage );

    //     if (response.data !== "out dated") {
    //       window.location.href = "/reports";
    //     } else {
    //       localStorage.removeItem("auth");
    //       message.error("Your account is out Dated contact with Admin!");
    //       navigate("/login");
    //     }
    // } catch (error) {
    //   message.error("Check your Internet connection!");
    // }
  }

  return (
    <Layout>

      <div style={{position: "relative"}}>
        <h2>Reports</h2>
        {/* onClick={() => setPopModal(true)} */}
        <Button className='add-new' onClick={() => setDownloadModal(true)} style={{position:"absolute", right: 150, zIndex: "1000", top: 45, height:"40px", padding:5, width:120 }} >Download <DownloadOutlined style={{marginLeft:"15px"}} /> </Button>
        <Button className='add-new' onClick={()=> setUploadModal(true)} style={{position:"absolute", right: 10, zIndex: "1000", top: 45, height:"40px", padding:5, width:120 }} >Upload <UploadOutlined /> </Button>
      </div>

      <div className="report-select-div">
                <Select
                  placeholder="Date"
                  style={{ width: 200, marginRight: 70 }}
                  allowClear={true}
                  onChange={(value) => value === undefined? setBillsData(fullBillsData) :getFormattedDate(Number(value))}
                >
                <Select.Option value="1">Last 1 Day</Select.Option>
                <Select.Option value="7">Last 7 Days</Select.Option>
                <Select.Option value="30">Last 30 Days</Select.Option>
              </Select>

                <Select
                  placeholder="Products"
                  style={{ width: 200, marginRight: 70 }}
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
                  style={{ width: 200, marginRight: 70 }}
                  allowClear={true}
                  onChange={(value) => value === undefined? setBillsData(fullBillsData) :setSlectedBills({
                    type:"customers",
                    value
                  })}
                >
                {fullBillsData.map(customer => {
                    if (customer.customerName !== "-----" && !uniqueNamesSet.has(customer.customerName)) {
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

      <Table dataSource={billsData} columns={columns} bordered />
      <Table style={{position: "absolute", left: "-9999px"}} dataSource={billsData} columns={columnsForDownload} bordered ref={targetRef} pagination={false} size="small" />
      
      { 
        popModal 
          && <Invoice 
          selectedBill={selectedBill}
          popModal={popModal}
          setPopModal={setPopModal}
            /> 
          }

<Modal title="Upload" visible={uploadModal} onCancel={() => setUploadModal(false) } footer={false}>
          <h3 style={{marginBottom: 50}}>Are you sure to upload all existing data to Cloud ---  <CloudUploadOutlined /> </h3>
            <div style={{display: "flex"}}>
                <Button className='upload-cancel' onClick={()=>{ setUploadModal(false)}}>Cancel</Button>
                <Button className='upload-confirm' onClick={()=>{  setUploadModal(false); uploadHandler()  }}>Upload</Button>
            </div>
</Modal>
<Modal title="Download" visible={downloadModal} onCancel={() => setDownloadModal(false) } footer={false}>
          <h3 style={{marginBottom: 50}}>Are you sure to Download all existing data --- <CloudDownloadOutlined /> </h3>
            <div style={{display: "flex"}}>
                <Button className='upload-cancel' onClick={()=>{ setDownloadModal(false)}}>Cancel</Button>
                <Button className='upload-confirm' onClick={()=>{  setDownloadModal(false); toPDF()}}>Download</Button>
            </div>
</Modal>
    </Layout>
  )
}

export default Reports;