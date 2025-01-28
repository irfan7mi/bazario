import React, { useState } from 'react'
import './Navbar.css';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import Logout from '@mui/icons-material/Logout';

const Navbar = ({setShowLogIn}) => {
    const {totalFromCart, url, token, setCartItem, setToken, setLogIn, logIn, category, setCategory, productData, setProductData } = useContext(StoreContext)
    const [searchData, setSearchData] = useState("")
    const [menu, setMenu] = useState('home')

    const Logout = () => {
      localStorage.removeItem("token")
      setToken("")
      setLogIn(false)
      setCartItem({});
    }

    const handleProductData = async (id) => {
      const response = await axios.get(`${url}/product/`+id)
      if (response.data.success) {
        setCategory(response.data.data.category);
      }
    }

  return (
    <div className="navbar-container">
        <Link to={'/'} className='company-name' onClick={() => {setMenu('home'); setCategory('All');}}>BAZARIO</Link>
        <ul className="menu">
            <Link to={'/'} onClick={() => {setMenu('home'); setCategory('All');}} className={menu === 'home' ? 'active' : ''}>Home</Link>
            <a href='#menu-list' onClick={() => {setMenu('men'); setCategory('men');}} className={menu === 'men' ? 'active' : ''}>Men</a>
            <a href='#menu-list' onClick={() => {setMenu('women'); setCategory('women')}} className={menu === 'women' ? 'active' : ''}>Woman</a>
            <a href='#menu-list' onClick={() => {setMenu('kids'); setCategory('kids')}} className={menu === 'kids' ? 'active' : ''}>Kids</a>
            <a href='#app-details' onClick={() => setMenu('about')} className={menu === 'about' ? 'active' : ''}>About</a>
            <a href='#app-details' onClick={() => setMenu('contact')} className={menu === 'contact' ? 'active' : ''}>Contact Us</a>
        </ul>

        <div className='search-cart-sign'>
          <div className="search-box">
            <SearchIcon className='search-icon'></SearchIcon>
            <input className='search-input' type="text" onChange={(e) => {setCategory(e.target.value.toUpperCase()); setSearchData(e.target.value)}} placeholder='Search category...'/>
            <div className="search-product-container">
              <p className='search-product-text'>{searchData}</p>
              {productData.map((item) => {
                if (category === "All" || category === item.category) {
                  return (
                <div className='search-product-data' onClick={() => setMenu('home')} key={item._id}>
                  <img src={item.image} alt="img" />
                  <a href='#menu-list' onClick={() => {handleProductData(item._id);}}>{item.name}</a>
                </div>
              )}})}
            </div>
          </div>
          {(logIn) ? <Link to={'/cart'}><ShoppingCartIcon className='cart' fontSize='medium'/>
          <div className={totalFromCart()===0 ? "no-cart" : "cart-status"}></div></Link> : <Link onClick={(e) => toast.error("SignIn your account!")}><ShoppingCartIcon className='cart'></ShoppingCartIcon>
          <div className={totalFromCart()===0 ? "no-cart" : "cart-status"}></div></Link>}
          {(token && logIn) ? 
          <div className='account-box-container'>
            <AccountCircleIcon fontSize='large' className='account-profile'/>
            <div className="account-box">
              <div className='account-box-content'>
                <MenuBookIcon fontSize='small'/>
                <Link to={'/PlaceOrder'} className='content-para'>Orders</Link>
              </div>
              <hr />
              <div className='account-box-content' onClick={Logout}>
                <LogoutIcon fontSize='small'/>
                <p className='content-para'>Logout</p>
              </div>
            </div>
          </div> : 
          <button className="sign-in" onClick={() => setShowLogIn(true)}>Log In</button>}
        </div>
    </div>
  )
}

export default Navbar;