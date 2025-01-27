import "./Add.css"
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { StoreContext } from "../../../context/Context"
import { useNavigate, useParams } from "react-router-dom"

const UpdateItem = () => {
  const {image, setImage, data, setData, url} = useContext(StoreContext)
  const navigate = useNavigate()
  const {id} = useParams()
  console.log(data)

  const fetchFoodList = async () => {
    const response = await axios.get(`${url}/product/list/`+id)
    setData(response.data.data)
    console.log(response.data.data.image)
  }

  useEffect(() => { 
    async function loadData() {
      await fetchFoodList()
    }
    loadData()
  },[])

  const eventHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setData(data => ({...data, [name]:value}))
  }

  const Submit = async (e) => {
    e.preventDefault()
    const formData =new FormData()
    formData.append("image", image)
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", data.price)
    formData.append("category", data.category)
    const response = await axios.post(`${url}/product/list/update/`+id, formData)
    if (response.data.success) {
      setData({
        name: "", 
        description: "", 
        price: "", 
        category: "Mobile"
      })   
      setImage(false)
      navigate('/list')
      toast.success(response.data.message)
    }
    else{
      toast.error(response.data.message)
    }
  }

  return (
    <div className="add-page">
      <form  onSubmit={Submit} className="add-container">
      <div className="add-item-container">
        <label htmlFor="">Upload Image</label>
          <input type="file" name="image" className="input-image" onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} required />
          {image ? 
          (
          <label htmlFor="">
            <img src={data.image} onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} className="preview-img" />
          </label>
          ) : (<> </>)}
        <label htmlFor="">Product name</label>
        <input type="text" name="name" value={data.name}  placeholder="Enter item name..." onChange={eventHandler} required/>
        <label htmlFor="">Product description</label>
        <textarea name="description" id="" value={data.description} placeholder="Ender item description..." onChange={eventHandler} required></textarea>
        <div className="price-category-container">
          <div className="price-container"> 
            <label htmlFor="" >Product price</label>
            <input type="number" name="price" className="price-input" value={data.price} placeholder="Enter item price..." onChange={eventHandler} required/>
          </div>
          <div className="category-container">
            <label htmlFor="">Product category</label>
            <select name="category" value={data.category} onChange={eventHandler}>
              <option value="MOBILE">Mobile</option>
              <option value="LAPTOP">Laptop</option>
              <option value="EARBUDS">Earbuds</option>
            </select>
          </div>
        </div>
        <button className="button">Submit</button>
      </div>
      </form>
    </div>
  )
}

export default UpdateItem
