import React, { useState } from "react";
import { FiX, FiSave } from "react-icons/fi";

const AdvanceAmountForm = ({ 
  orderId, 
  totalAmount, 
  onSave, 
  onClose 
}) => {
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [saving, setSaving] = useState(false);

const handleSave = async () => {
  if (!advanceAmount || parseFloat(advanceAmount) <= 0) {
    alert("Please enter a valid advance amount");
    return;
  }

  if (parseFloat(advanceAmount) > totalAmount) {
    alert("Advance amount cannot exceed total amount");
    return;
  }

  setSaving(true);
  try {
    // This calls the handleSaveAdvanceAmount function from Orders component
    await onSave({
      orderId,
      totalAmount,
      advanceAmount: parseFloat(advanceAmount),
      balanceAmount: totalAmount - parseFloat(advanceAmount)
    });
  } finally {
    setSaving(false);
  }
};

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAdvanceAmount(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
        <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg">
                  {/* <FiDollarSign className="text-white text-lg" /> */}
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Advance Payment
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Order Information */}
            <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200/50 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-normal text-blue-700">Order ID:</span>
                  <span className="font-bold text-blue-800">{orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-normal text-blue-700">Total Amount:</span>
                  <span className="font-bold text-blue-800">
                    Rs. {totalAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Advance Amount Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Advance Amount 
                </label>
                <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
  <span className="text-slate-400 font-medium">Rs.</span>
</div>
                  <input
                    type="text"
                    value={advanceAmount}
                    onChange={handleAmountChange}
                    placeholder="Enter advance amount"
                    className="w-full border border-slate-300 pl-10 pr-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-base"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the advance payment amount (cannot exceed total amount)
                </p>
              </div>

              {/* Calculated Balance */}
              {advanceAmount && !isNaN(parseFloat(advanceAmount)) && (
                <div className="bg-green-50/80 p-4 rounded-xl border border-green-200/50">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-normal text-green-700">Advance Amount:</span>
                      <span className="font-bold text-green-800">
                        Rs. {parseFloat(advanceAmount).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-normal text-green-700">Balance Amount:</span>
                      <span className="font-bold text-green-800">
                        Rs. {(totalAmount - parseFloat(advanceAmount)).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal text-base"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving || !advanceAmount || parseFloat(advanceAmount) <= 0}
                className="px-6 py-2.5 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-base"
              >
                {saving ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FiSave className="mr-2" />
                    Save Advance
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvanceAmountForm;