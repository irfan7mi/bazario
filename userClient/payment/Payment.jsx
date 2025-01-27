import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext'
import './Payment.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentForm = ({ onPaymentComplete, setTogglePromoPay }) => {
  const { product_list, cartItem, url } = useContext(StoreContext)
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
  });

  const items = product_list
      .filter((item) => cartItem[item._id] > 0)
      .map((item) => ({ ...item, quantity: cartItem[item._id] }));
  console.log("Items: ",items)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/order/payment`, {items});
      if (response.data.success) {
        toast.success('Payment successful!');
        onPaymentComplete();
        setTogglePromoPay(true);
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during payment processing.');
      console.error(error);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2>Payment Details</h2>
      <input
        type="text"
        name="cardHolderName"
        placeholder="Cardholder Name"
        value={paymentData.cardHolderName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="cardNumber"
        placeholder="Card Number"
        value={paymentData.cardNumber}
        onChange={handleChange}
        required
        maxLength="10"
      />
      <div className="card-details">
        <input
          type="text"
          name="expiryDate"
          placeholder="MM/YY"
          value={paymentData.expiryDate}
          onChange={handleChange}
          maxLength="5"
          required
        />
        <input
          type="password"
          name="cvv"
          placeholder="CVV"
          value={paymentData.cvv}
          onChange={handleChange}
          required
          maxLength="3"
        />
      </div>
      <button type="submit" className="submit-payment">Submit Payment</button>
    </form>
  );
};

export default PaymentForm;
