import React, { useContext } from "react";
import "./Item.css";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { StoreContext } from "../../../context/StoreContext";

const Item = ({ id, name, image, description, price, averageRating }) => {
    const { cartItem, addToCart, removeFromCart, url } = useContext(StoreContext);

    return (
        <div className="product-display-container">
            <div className="product-img-cart-count">
            <img className="product-img-container" src={image || 'https://via.placeholder.com/50'} alt={name || "Food Image"} onError={(e) => {e.target.src = 'https://via.placeholder.com/50';}}/>
                {!cartItem[id] ? (
                    <p className="add-item-zero" onClick={() => {addToCart(id)}}>
                        <AddIcon fontSize='small'/>
                    </p>
                ):(
                    <div className="cart-item-container">
                        <p className="remove-item" onClick={() => {removeFromCart(id)}}>
                            <RemoveIcon fontSize='small'/>
                        </p>
                        <p className="count-item">{cartItem[id]}</p>
                        <p className="add-item" onClick={() => {addToCart(id)}}>
                            <AddIcon fontSize='small'/>
                        </p>
                    </div>
                 ) 
                }
            </div>
            <div className="product-info">
                <div className="product-display-title">
                    <p className="product-display-name">{name}</p>
                </div>
                <div className="product-display-details">
                    <p>{description}</p>
                </div>
                <div className="product-display-rating">
                    {averageRating !== undefined && averageRating !== null ? (
                        <>
                            <p className="rating">
                                ⭐ {averageRating.toFixed(1)} / 5
                            </p>
                            <p className="price-info">₹{price}</p>
                        </>
                    ) : (<p className="no-rating">Not Rated Yet</p>)
                    }
                </div>
            </div>
        </div>
    );
};

export default Item;