import React, { useContext, useEffect } from "react";
import Item from "../Item/Items";
import "./ItemDisplay.css";
import { StoreContext } from "../../../context/StoreContext";
import axios from "axios";

const ItemDisplay = () => {
  const { category, productData, setProductData , url } = useContext(StoreContext);

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await axios.get(`${url}/product/list`);
        if (response.data.success) {
          setProductData(response.data.data || []);
        } else {
          console.error("Failed to fetch items: ", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setProductData([]); // Set an empty list to prevent errors
      }
    };

    fetchProductList();
  }, [setProductData, url]); 
  
  return (
    <div className="product-display">
      <div className="product-display-list">
        {productData.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <Item
                key={index}
                id={item._id}
                name={item.name}
                image={item.image}
                description={item.description}
                price={item.price} 
                averageRating={item.averageRating} 
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default ItemDisplay;