import React, {useEffect, useRef} from 'react'
import { useReactToPrint } from 'react-to-print';
import { Button, Modal, Table } from 'antd';

function Invoice( {selectedBill, popModal, setPopModal } ) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });

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
                <span>Number: <b>+381/0000000</b></span>
                <span>Address: <b>34000 ABCD, EFGH</b></span>
            </div>
            <div className="cardBody">
                <div className="group">
                    <span>Customer Name:</span>
                    <span><b>{selectedBill.customerName}</b></span>
                </div>
                <div className="group">
                    <span>Customer Phone:</span>
                    <span><b>{selectedBill.customerPhone}</b></span>
                </div>
                <div className="group">
                    <span>Customer Address:</span>
                    <span><b>{selectedBill.customerAddress}</b></span>
                </div>
                <div className="group">
                    <span>Payment Method:</span>
                    <span><b>{selectedBill.paymentMethod}</b></span>
                </div>
                <div className="group">
                    <span>Date Order:</span>
                    <span><b>{selectedBill.createdAt? selectedBill.createdAt.toString().substring(0, 10) : new Date().toISOString().split('T')[0]}</b></span>
                </div>
            </div>
            
                <h4 className="YourOrderText">Your Order</h4>
            <Table columns={columns} dataSource={selectedBill.cartItems} pagination={false} size="small" />

                <div className="footerCardTotal">
                    <div className="group">
                        <h3 >Tax:</h3>
                        <h3><b className="total">+ Rs {selectedBill.tax}</b></h3>
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
            <div className="cardBody">
                <div className="group">
                    <span>Customer Name:</span>
                    <span><b>{selectedBill.customerName}</b></span>
                </div>
                <div className="group">
                    <span>Customer Phone:</span>
                    <span><b>{selectedBill.customerPhone}</b></span>
                </div>
                <div className="group">
                    <span>Customer Address:</span>
                    <span><b>{selectedBill.customerAddress}</b></span>
                </div>
                <div className="group">
                    <span>Payment Method:</span>
                    <span><b>{selectedBill.paymentMethod}</b></span>
                </div>
                <div className="group">
                    <span>Date Order:</span>
                    <span><b>{selectedBill.createdAt? selectedBill.createdAt.toString().substring(0, 10) : new Date().toISOString().split('T')[0]}</b></span>
                </div>
            </div>
            
                <h4 className="YourOrderText">His Order</h4>
            <Table columns={columns} dataSource={selectedBill.cartItems} pagination={false} size="small" />

                <div className="footerCardTotal">
                    <div className="group">
                        <h3 >Tax:</h3>
                        <h3><b className="total">+ Rs {selectedBill.tax}</b></h3>
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