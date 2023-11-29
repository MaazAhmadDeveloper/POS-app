import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout'
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Invoice from '../invoices/Invoice';

const Cart = () => {

    const [subTotal, setSubTotal] = useState(0);
    const [billPopUp, setBillPopUp] = useState(false);
    const [billDataNumbers, setBillsDataNumbers] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState([]);
    const [enterPressCount, setEnterPressCount] = useState(0);
    const [invoicepopModal, setInvoicePopModal] = useState(false);

    const dispatch = useDispatch();

    const {cartItems} = useSelector(state => state.rootReducer);

    const handlerIncrement = (record) => {
        dispatch({
            type: "UPDATE_CART",
            payload: {...record, quantity: record.quantity + 1}
        });
    };

    const handlerDecrement = (record) => {
        if(record.quantity !== 1){
            dispatch({
                type: "UPDATE_CART",
                payload: {...record, quantity: record.quantity - 1}
            });
        }
    };

    const handlerDelete = (record) => {
        dispatch({
            type: "DELETE_FROM_CART",
            payload: record
        });
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Image",
            dataIndex: "image",
            render:(image, record) => <img src={image} alt={record.name} height={50} width={90} style={{borderRadius: 10}}/>
        }, 
        {
            title: "Price",
            dataIndex: "price",
        }
        , 
        {
            title: "Quantity",
            dataIndex: "_id",
            render:(id, record) => 
                <div>
                    <MinusCircleOutlined className='cart-minus' onClick={() => handlerDecrement(record)}/>
                    <strong className='cart-quantity'>{record.quantity}</strong>
                    <PlusCircleOutlined className='cart-plus' onClick={() => handlerIncrement(record)} />
                </div>
        }
        , 
        {
            title: "Action",
            dataIndex: "_id",
            render:(id, record) => <DeleteOutlined className='cart-action' onClick={() => handlerDelete(record)} />
        }
    ]

    useEffect(() => {

        let temp = 0;
        cartItems.forEach((product) => (temp = temp + product.price * product.quantity));
        setSubTotal(temp); 

    }, [cartItems]);

    useEffect(()=>{
      const getAllBills = async () => {
        try {
          dispatch({
            type: "SHOW_LOADING",
          });
          const {data} = await axios.get('/api/bills/getbills');
          setBillsDataNumbers(data.length +1000);
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

      getAllBills();
      
    },[]);

useEffect(() => {

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (cartItems.length !== 0) {
        e.preventDefault();
        setEnterPressCount((prevCount) => prevCount + 1);
  
        if (enterPressCount === 0) {
          setBillPopUp(true);
        } else if (enterPressCount === 1) {
          document.getElementById('submitButton').click();
          setBillPopUp(false)
          setInvoicePopModal(true);
        }
      }else{
        message.error("Your Cart is empty")
      }

    }
  };

  document.addEventListener('keypress', handleKeyPress);

  // Clean up the event listener when the component is unmounted
  return () => {
    document.removeEventListener('keypress', handleKeyPress);
  };
}, [enterPressCount, setBillPopUp]);

    const handlerSubmit = async (value) => {
      // console.log(value);
        try {
            const newObject = {
              billNumber: billDataNumbers,
              customerAddress: value.customerAddress !== undefined && value.customerAddress !== null && value.customerAddress !== "" && value.customerAddress !== " " ? value.customerAddress : "(Empty)",
              customerName: value.customerName !== undefined && value.customerName !== null && value.customerName !== "" && value.customerName !== " " ? value.customerName.toString() : "(Unknown)",
              customerPhone: value.customerPhone !== undefined && value.customerPhone !== null && value.customerPhone !== "" && value.customerPhone !== " " ? value.customerPhone.toString() : "(Empty)",
              paymentMethod: value.paymentMethod !== undefined && value.paymentMethod !== null && value.paymentMethod !== "" && value.paymentMethod !== " " ? value.paymentMethod : "Cash",
                cartItems,
                subTotal,
                tax: Number(((subTotal / 100) * 10).toFixed(2)),
                totalAmount: Number((Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))).toFixed(2)),
                // userId: JSON.parse(localStorage.getItem("auth"))._id
            }
            setSelectedInvoice(newObject)
            // console.log(newObject);

            await axios.post("/api/bills/addbills", newObject);
            message.success("Bill Generated!");

            dispatch({
              type: "EMPTY_CART", 
            });

            setBillPopUp(false)
            setInvoicePopModal(true);

        } catch(error) {
            message.error("Error!")
            console.log(error);
        }
        setEnterPressCount(0);
    }


  return (
    <Layout>
      <h2>Cart</h2>
      <Table dataSource={cartItems} columns={columns} bordered />
      <div className="subTotal">
        <h2>Sub Total: <span>Rs {(subTotal).toFixed(2)}</span></h2>
        <Button onClick={() => cartItems.length !==0 ? setBillPopUp(true) : message.error("Your Cart is empty")} className='add-new'>Create Invoice</Button>
      </div>
      <Modal title="Create Invoice" visible={billPopUp} onCancel={() => setBillPopUp(false) } footer={false}>
        <Form id='generateInvoiveform' layout='vertical' onFinish={handlerSubmit}>
            <FormItem name="customerName" label="Customer Name">
              <Input placeholder='(Optional)' />
            </FormItem>
            <FormItem name="customerPhone" label="Customer Phone">
              <Input placeholder='(Optional)' />
            </FormItem>
            <FormItem name="customerAddress" label="Customer Address">
              <Input placeholder='(Optional)' />
            </FormItem>
            <FormItem name="paymentMethod" label="Payment Method">
              <Select defaultValue="Cash" style={{ width: "100%"}}>
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="Jazzcash">Jazzcash</Select.Option>
              </Select>
            </FormItem>
            <div className="total">
                <span>SubTotal: Rs {(subTotal.toFixed(2))}</span><br />
                <span>Tax: Rs {((subTotal / 100) * 10).toFixed(2)}</span>
                <h3>Total: Rs {(Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))).toFixed(2)}</h3>
            </div>
            <div className="form-btn-add">
              <Button id='submitButton' htmlType='submit' className='add-new' >Generate Invoice</Button>
            </div>  
        </Form>
      </Modal>

      { 
        invoicepopModal 
          && <Invoice 
          selectedBill={selectedInvoice}
          popModal={invoicepopModal}
          setPopModal={setInvoicePopModal}
            /> 
          }

    </Layout>
  )
}

export default Cart
