import { Button, Form, Input, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlerSubmit = async (value) => {
    //console.log(value);
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.post('http://16.171.43.209:3001/api/users/checkusers', value);
      console.log(data);
      dispatch({
        type: "HIDE_LOADING", 
      });
      
    if(data.access === "allow") {
      localStorage.setItem('auth', JSON.stringify(data));
      message.success("Welcome " + data.name + " to POS");
      navigate("/");
      }else if(data.access === "outdated"){
        message.error("Please Contact with Admin this account is out dated!");
      }else if(data.access === "not allow"){
        message.error("This account is already Login on other device");
      }

    } catch(error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      message.error("Try Again Some thing went wrong!");
      console.log(error);
    }
  }

  useEffect(() => {
    const storage = localStorage.getItem('auth');
    const parsedStorage = JSON.parse(storage)

    if(parsedStorage !== null && parsedStorage.access === "allow") {
      navigate("/");
    }
    
  }, [navigate]);

  return (
    <div className='form'>
        <h2>POS SYSTEM</h2>
        <p>Login</p>
        <div className="form-group">
          <Form layout='vertical' onFinish={handlerSubmit}>
            <FormItem name="userName" label="User Name">
              <Input placeholder='User Name'/>
            </FormItem>
            <FormItem name="email" label="Email Address">
              <Input placeholder='Enter Email Address'/>
            </FormItem>
            <FormItem name="password" label="Password">
              <Input type="password" placeholder='Enter Password'/>
            </FormItem>
            <div className="form-btn-add">
              <Button htmlType='submit' className='add-new'>Login</Button>
            </div>
          </Form>
        </div>
    </div>
  )
}

export default Login
