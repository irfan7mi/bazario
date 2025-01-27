import "./Add.css";
import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../../context/Context.jsx";

const Add = () => {
  const [image, setImage] = useState(false);
  const {url} = useContext(StoreContext)
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Mobile"
  });

  const eventHandler = (e) => {
    const name = e.target.name;
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const Submit = async (e) => {
    e.preventDefault();
    // Validate token existence
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not logged in! Please log in to proceed.");
      return;
    }
  
    // Create FormData object
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("averageRating", null);
  
    try {
      // Make API request
      const response = await axios.post(`${url}/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      // Handle success
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Mobile"
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        // Handle server-side error message
        toast.error(response.data.message || "Failed to add item.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add item. Please try again.");
    }
  };

  return (
    <div className="add-page">
      <form onSubmit={Submit} className="add-container">
        <div className="add-item-container">
          <label htmlFor="">Upload Image</label>
          <input
            type="file"
            name="image"
            className="input-image"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          {image ? (
            <label htmlFor="">
              <img
                src={image ? URL.createObjectURL(image) : ""}
                className="preview-img"
              />
            </label>
          ) : (
            <> </>
          )}

          <label htmlFor="">Product name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            placeholder="Enter item name..."
            onChange={eventHandler}
            required
          />

          <label htmlFor="">Product description</label>
          <textarea
            name="description"
            value={data.description}
            placeholder="Enter food description..."
            onChange={eventHandler}
            required
          ></textarea>

          <div className="price-category-container">
            <div className="price-container">
              <label htmlFor="">Product price</label>
              <input
                type="number"
                name="price"
                className="price-input"
                value={data.price}
                placeholder="Enter item price..."
                onChange={eventHandler}
                required
              />
            </div>
            <div className="category-container">
              <label htmlFor="">Product category</label>
              <select name="category" value={data.category} onChange={eventHandler}>
                <option value="mobile">Mobile</option>
                <option value="laptop">Laptop</option>
                <option value="earbuds">Earbuds</option>
              </select>
            </div>
          </div>
          <button className="button">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Add;