import React, {useEffect, useRef} from 'react'
import { useReactToPrint } from 'react-to-print';
import { Button, Modal, Table } from 'antd';

function Invoice( {selectedBill, popModal, setPopModal } ) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });

      useEffect(()=>{
        console.log(selectedBill);
      },[])
    const generateInvoiceClickHandle = ()=>{
        setPopModal(false);
        handlePrint();
    }
      const columns = [
        {
            title: "Product",
            dataIndex: "name"
        },
        {
            title: "Price",
            dataIndex: "price",
        }, 
        {
            title: "Qty",
            dataIndex: "quantity",
        }, 
        {
            title: "Sub Total",
            dataIndex: "quantity",
            render: (data, allData) => data * allData.price
        }
      ]

useEffect(() => {
        const handleKeyPress = (e) => {
          if (e.key === 'Enter' && popModal === true) {
              handlePrint();
              setPopModal(false);
          }
    };
    document.addEventListener('keypress', handleKeyPress);
      
        // Clean up the event listener when the component is unmounted
    return () => {
        document.removeEventListener('keypress', handleKeyPress);
    };
}, []);


  return (
    <div>
        <Modal title="Invoice Details" width={400} pagination={false} visible={popModal} onCancel={() => setPopModal(false)} footer={false}>

          <div className="card" ref={componentRef}>
            <div className="cardHeader">
                <h2 className="logo">MP POS</h2>
                <span>Number: <b>+92300000000</b></span>
                <span>Address: <b> ABCD, EFGH, IJKL</b></span>
            </div>

            <div className='order_waiter'>
                <div>Order Type: &nbsp; <b> { selectedBill.orderType} </b></div>

                { selectedBill.waiterName !== "-----" ?
                    <div>Waiter: &nbsp; <b> { selectedBill.waiterName} </b></div>
                :
                    null
                }
            </div>

            <div className="cardBody">
                <div className="group">
                    <span>Bill Number:</span>
                    <span><b>{selectedBill.billNumber}</b></span>
                </div>
                { selectedBill.customerName !== "-----" && <div className="group">
                    <span>Customer Name:</span>
                    <span><b>{selectedBill.customerName}</b></span>
                </div>}
                { selectedBill.customerPhone !== "-----" &&<div className="group">
                    <span>Customer Phone:</span>
                    <span><b>{selectedBill.customerPhone}</b></span>
                </div>}
                { selectedBill.customerAddress !== "-----" &&<div className="group">
                    <span>Customer Address:</span>
                    <span><b>{selectedBill.customerAddress}</b></span>
                </div>}
                <div className="group">
                    <span>Payment Method:</span>
                    <span><b>{selectedBill.paymentMethod}</b></span>
                </div>
                <div className="group">
                    <span>Date Order:</span>
                    <span><b>{selectedBill.createdAt? new Date(selectedBill.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</b></span>
                </div>
            </div>
            
                <h4 className="YourOrderText">Your Order</h4>
            <Table columns={columns} dataSource={selectedBill.cartItems} pagination={false} size="small" />

                <div className="footerCardTotal">
                    <div className="group">
                        <h3 >Discount:</h3>
                        <h3><b className="total">- Rs {selectedBill.discount}</b></h3>
                    </div>
                    <div className="group">
                        <h3 >Total:</h3>
                        <h3><b className="total">Rs {selectedBill.totalAmount}</b></h3>
                    </div>
                </div>
                <div className="footerThanks">
                    <span>Thank You for buying from us</span>
                </div>
                
                {/* For shop */}
            <div className="cardHeader">
                <h2 className="logo">For Shop</h2>

            </div>
            <div className='order_waiter'>
                <div>Order Type: &nbsp; <b> { selectedBill.orderType} </b></div>
                
                { selectedBill.waiterName !== "-----" &&
                        <div>Waiter: &nbsp; <b> { selectedBill.waiterName} </b></div>
                    }
            </div>
            <div className="cardBody">
            <div className="group">
                    <span>Bill Number:</span>
                    <span><b>{selectedBill.billNumber}</b></span>
                </div>
            { selectedBill.customerName !== "-----" && <div className="group">
                    <span>Customer Name:</span>
                    <span><b>{selectedBill.customerName}</b></span>
                </div>}
                { selectedBill.customerPhone !== "-----" &&<div className="group">
                    <span>Customer Phone:</span>
                    <span><b>{selectedBill.customerPhone}</b></span>
                </div>}
                { selectedBill.customerAddress !== "-----" &&<div className="group">
                    <span>Customer Address:</span>
                    <span><b>{selectedBill.customerAddress}</b></span>
                </div>}
                <div className="group">
                    <span>Payment Method:</span>
                    <span><b>{selectedBill.paymentMethod}</b></span>
                </div>
                <div className="group">
                    <span>Date Order:</span>
                    <span><b>{selectedBill.createdAt? new Date(selectedBill.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</b></span>
                </div>
            </div>
            
                <h4 className="YourOrderText">Order Number: {selectedBill.orderNumber}</h4>
            <Table columns={columns} dataSource={selectedBill.cartItems} pagination={false} size="small" />

                <div className="footerCardTotal">
                    <div className="group">
                        <h3 >Discount:</h3>
                        <h3><b className="total">- Rs {selectedBill.discount}</b></h3>
                    </div>
                    <div className="group">
                        <h3 >Total:</h3>
                        <h3><b className="total">Rs {selectedBill.totalAmount}</b></h3>
                    </div>
                </div>
                
            </div>

          <div className="bills-btn-add">
            <Button onClick={generateInvoiceClickHandle} htmlType='submit' className='add-new'>Generate Invoice</Button>
        </div>  
        </Modal>
    </div>
  )
}

export default Invoice