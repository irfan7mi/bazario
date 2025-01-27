import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000"
  const [logIn, setLogIn] = useState(false);
  const [token, setToken] = useState("");
  
  const [cartItem, setCartItem] = useState(() => {
    const savedCart = localStorage.getItem("cartItem");
    return (savedCart && logIn) ? JSON.parse(savedCart) : {};
  });
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [product_list, setProductList] = useState([]);
  const [category, setCategory] = useState('All');
  const [productData, setProductData ] = useState([])

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await axios.get(`${url}/product/list`);
        if (response.data.success) {
          setProductList(response.data.data || []);
        } else {
          console.error("Failed to fetch items: ", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setProductList([]);
      }
    };

    fetchProductList();
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItem", JSON.stringify(cartItem));
  }, [cartItem]);

  const addToCart = async (itemId) => {
    if (logIn) {
        if (!cartItem[itemId]) {
            setCartItem((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
    }
    else toast.error("SignIn your account!");
    if (token) {
      const response = await axios.post(url + "/cart/add", { itemId, email });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItem((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });

    if (token) {
      const response = await axios.post(url + "/cart/remove", { itemId, email });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }
  };

  const totalFromCart = () => {
    let totalAmount = 0;

    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        const itemInfo = product_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItem[item];
        } else {
          console.warn(`Item with ID ${item} not found in item_list.`);
        }
      }
    }
    return totalAmount;
  };

  const processPayment = async (paymentDetails) => {
    try {
      const response = await axios.post(`${url}/payment`, {
        userId,
        email,
        items: cartItem,
        amount: totalFromCart(),
        paymentDetails,
      });

      if (response.data.success) {
        toast.success("Payment successful!");
        setCartItem({}); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Error processing payment. Please try again.");
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const contextValue = {
    logIn,
    setLogIn,
    userId,
    setUserId,
    product_list,
    url,
    cartItem,
    token,
    setToken,
    setEmail,
    setCartItem,
    addToCart,
    removeFromCart,
    totalFromCart,
    category,
    setCategory,
    processPayment,
    productData, 
    setProductData 
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;