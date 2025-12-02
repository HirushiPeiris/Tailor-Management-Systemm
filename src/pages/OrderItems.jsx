import React, { useState } from "react";

const AddOrderItem = () => {
  const [orderData, setOrderData] = useState({
    customerId: "",
    orderDate: "",
    deliveryDate: "",
    status: "Pending",
    totalAmount: "",
  });

  const [items, setItems] = useState([
    { garmentType: "", fabricType: "", price: "", quantity: "" },
  ]);

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { garmentType: "", fabricType: "", price: "", quantity: "" }]);
  };

  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order:", orderData);
    console.log("Items:", items);
    // TODO: Send orderData and items to backend
  };

  

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Order</h1>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            name="customerId"
            placeholder="Customer ID"
            value={orderData.customerId}
            onChange={handleOrderChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <input
            type="date"
            name="orderDate"
            value={orderData.orderDate}
            onChange={handleOrderChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <input
            type="date"
            name="deliveryDate"
            value={orderData.deliveryDate}
            onChange={handleOrderChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <input
            type="text"
            name="status"
            value={orderData.status}
            onChange={handleOrderChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="number"
            step="0.01"
            name="totalAmount"
            placeholder="Total Amount"
            value={orderData.totalAmount}
            onChange={handleOrderChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Order Items</h2>

          {items.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3 relative">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700"
                >
                  &times;
                </button>
              )}
              <input
                type="text"
                name="garmentType"
                value={item.garmentType}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Garment Type"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                name="fabricType"
                value={item.fabricType}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Fabric Type"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                step="0.01"
                name="price"
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Price"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Quantity"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={addItem}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              + Add Another Item
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Submit Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderItem;
