import React, {useEffect, useState} from "react";
import OrderCard from "../../components/user/OrderCard";
import api from "../../config/axiosConfig";
import {useNavigate} from "react-router-dom";
import { Pagination } from "@mui/material";

const Orders = () => {
  const [myOrders, setMyOrders] = useState([]);
  console.log("myOrders", myOrders);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 8; 

  const getMyOrders = async (currentPage) => {
    try {
      const response = await api.get(`/order/orders?page=${currentPage}&limit=${limit}`);
      setMyOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyOrders(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCancelOrder = async (orderId, productId) => {
    try {
      const response = await api.post("order/cancel-order", {
        orderId,
        productId,
      });
      getMyOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReturnOrder = async (orderId, productId, reason) => {
    console.log("Return order with ID:", orderId, productId, reason);
    try {
      await api.post("/order/return-order", {orderId, productId, reason});
      getMyOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const handleViewOrderDetials = (orderId) => {
    navigate(`/view-order-detial/${orderId}`);
  };


  const handleRetryPayment = (orderId) => {
    navigate(`/payment-failed/${orderId}`)
  }

  return (
    <div>
      <div className="py-3">
        <h1 className="text-2xl font-bold my-2">My Orders</h1>
        {myOrders?.map((order) => (
          <div key={order._id} className="mb-4">
            <div className="flex justify-start gap-3 items-center pb-1 pt-2">
              <h2 className="font-semibold">
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
              </h2>
              {order.status === "Payment Failed" ? (
             
                <button className="text-red-600 hover:text-red-500 font-semibold"
                onClick={() => handleRetryPayment(order?._id)}>RETRY PAYMENT</button>
              ) : (
                <button
                className="text-blue-600 hover:text-blue-500"
                onClick={() => handleViewOrderDetials(order?._id)}
              >
                View Detials
              </button>
              )}
            </div>
            {order?.items?.map((item) => (
              <OrderCard
                key={item._id}
                productName={item.productName}
                productBrand={item.productBrand}
                size={item.size}
                quantity={item.quantity}
                totalPrice={item.totalPrice}
                status={item.status}
                thumbnail={item.thumbnail}
                deliveryStatus={order.status}
                paymentMethod={order.payment.method}
                orderDate={order.createdAt}
                handleCancelOrder={handleCancelOrder}
                handleReturnOrder={handleReturnOrder}
                orderId={order._id}
                productId={item.product}
                itemStatus={order.status}
              />
            ))}
          </div>
        ))}
      </div>
      <Pagination
        count={totalPages}  
        page={page} 
        onChange={handlePageChange}  
        variant="outlined"
        shape="rounded"
        color="primary"
      />
    </div>
  );
};

export default Orders;
