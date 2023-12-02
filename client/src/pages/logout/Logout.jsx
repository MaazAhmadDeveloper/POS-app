import React, { useState } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function Logout({ collapsed }) {
    const [logoutModal, setLogoutModal] = useState(false)
    const navigate = useNavigate();

  const handlerLogout = () => {
        localStorage.removeItem("auth");
         navigate("/login");
  };

  return (
    <div>
        <LogoutOutlined style={{ color: '#001e28', margin: "15px 20px 0px 0px"}} onClick={()=> setLogoutModal(true) } />

      <Modal title="Logout" visible={logoutModal} onCancel={() => setLogoutModal(false) } footer={false}>
          <h3 style={{marginBottom: 50}}>Are you sure to logout</h3>
            <div style={{display: "flex"}}>
                <Button className='cancel-category' onClick={()=>{ setLogoutModal(false)}}>Cancel</Button>
                <Button className='logout-confirm' onClick={()=>{  setLogoutModal(false); handlerLogout()  }}>Logout</Button>
            </div>
      </Modal>
    </div>
  );
}

export default Logout;
