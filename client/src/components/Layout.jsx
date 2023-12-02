import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  AppstoreAddOutlined,
  MoneyCollectOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  SnippetsOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import './layout.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';
import Logout from '../pages/logout/Logout';

const { Header, Sider, Content } = Layout;

const LayoutApp = ({children, headerInput, categories}) => {
  const {cartItems, loading} = useSelector(state => state.rootReducer);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const { pathname } = location;

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems]);

  return (
    <Layout>
      {loading && <Spinner />}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
            <h2 className="logo-title">POS SYSTEM</h2>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={window.location.pathname}>
            <Menu.Item key='/' icon={<HomeOutlined />}>
                <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/products" icon={<AppstoreAddOutlined  />}>
                <Link to="/products">Products</Link>
            </Menu.Item>
            <Menu.Item key="/categories" icon={<BranchesOutlined />}>
                <Link to="/categories">Categories</Link>
            </Menu.Item>
            <Menu.Item key='/invoice' icon={<MoneyCollectOutlined />}>
                <Link to="/invoice">Invoices</Link>
            </Menu.Item>
            <Menu.Item key='/reports' icon={<SnippetsOutlined />}>
                <Link to="/reports">Reports</Link>
            </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggle,
          })}

        {headerInput}

          <div className="cart-items" onClick={() => navigate('/cart')}>
            <ShoppingCartOutlined />
            <span className="cart-badge">{cartItems.length}</span>
          </div>
          <Logout 
              collapsed={collapsed}
          />

        </Header>

        { pathname === "/" && <Content
                  className="site-layout-background"
                  style={{
                    margin: '10px 24px 0px 16px',
                    height: "100px",
                    borderRadius: 10,
                    maxHeight: 80
                  }}
          >
            {categories}
        </Content>}
         
        <Content
          className="site-layout-background"
          style={{
            margin: '10px 24px 16px 16px',
            padding: "24px",
            minHeight: 280,
            borderRadius: 10,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;