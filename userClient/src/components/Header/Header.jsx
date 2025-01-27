import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
        <div className="header-contents">
          <div className="discount-container">
            <h1>30% discount</h1>
            <p>Use the mazingdiscount offers and enjoying</p>
            <button className="view-btn" >View Products</button>
          </div>
        </div>
    </div>
  )
}

export default Header