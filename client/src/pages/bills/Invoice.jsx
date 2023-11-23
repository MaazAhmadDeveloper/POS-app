import React, {useEffect, useRef} from 'react'
import { useReactToPrint } from 'react-to-print';
import { Button, Modal, Table } from 'antd';

function Invoice( {selectedBill, popModal, setPopModal } ) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });

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
                    <span>Date Order:</span>
                    <span><b>{selectedBill.createdAt.toString().substring(0, 10)}</b></span>
                </div>
                {/* <div className="group">
                    <span>Total Amount:</span>
                    <span><b>${selectedBill.totalAmount}</b></span>
                </div> */}
            </div>
            
                <h4 className="YourOrderText">Your Order</h4>
            <Table columns={columns} dataSource={selectedBill.cartItems} pagination={false} size="small" />
{/* 

            <div className="cardFooter">
                <h4>Your Order</h4>
                {selectedBill.cartItems.map((product) => (
                    <>
                        <div className="footerCard">
                            <div className="group">
                                <span>Product:</span>
                                <span><b>{product.name}</b></span>
                            </div>
                            <div className="group">
                                <span>Qty:</span>
                                <span><b>{product.quantity}</b></span>
                            </div>
                            
                            <div className="group">
                                <span>Price:</span>
                                <span><b>${product.price}</b></span>
                            </div>
                        </div>
                    </>
                ))} */}

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
                </div>


          {/* </div> */}
          <div className="bills-btn-add">
            <Button onClick={handlePrint} htmlType='submit' className='add-new'>Generate Invoice</Button>
        </div>  
        </Modal>
    </div>
  )
}

export default Invoice