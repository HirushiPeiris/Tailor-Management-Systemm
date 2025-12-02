import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit,
  FiSave,
  FiLayers
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllCategory, AddCategory } from '../actions/categoryAction';

function Categories() {
  const dispatch = useDispatch();

  // Redux selectors
  const getAllCategory = useSelector((state) => state.getAllCategory || {});
  const { loading, responseBody: categories = [], error, msg } = getAllCategory;

  const addCategory = useSelector((state) => state.addCategory || {});
  const { loading: adding, error: addError, msg: addMsg } = addCategory;

  // State management
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [formError, setFormError] = useState('');
  const [notification, setNotification] = useState(null);
  
  // State for editing
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Fetch categories
  useEffect(() => {
    dispatch(GetAllCategory());
  }, [dispatch]);

  // Show success/error toast after add
  useEffect(() => {
    if (!adding && (addMsg || addError)) {
      if (addError) {
        setNotification({ type: 'error', message: addError || 'Failed to add category!' });
      } else if (addMsg) {
        setNotification({ type: 'success', message: addMsg || 'Category added successfully!' });
        setShowModal(false);
        setCategoryName('');
        dispatch(GetAllCategory());
      }
      const timer = setTimeout(() => setNotification(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [addMsg, addError, adding, dispatch]);

  // Handle add category with duplicate check
  const handleAddCategory = (e) => {
    e.preventDefault();
    const name = categoryName.trim();
    if (!name) {
      setFormError('Please enter a category name');
      return;
    }

    const exists = categories.some(
      (c) => c.CategoryName.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setNotification({ type: 'error', message: 'Category already exists!' });
      setTimeout(() => setNotification(null), 1500);
      return;
    }

    setFormError('');
    dispatch(AddCategory({ CategoryName: name }));
  };

  // Handle edit category
  const handleEditClick = (category) => {
    setEditingId(category.CategoryId);
    setEditName(category.CategoryName);
  };

  // Handle save edited category
  const handleSaveEdit = (category) => {
    const name = editName.trim();
    if (!name) {
      setNotification({ type: 'error', message: 'Please enter a category name' });
      return;
    }

    const exists = categories.some(
      (c) => 
        c.CategoryId !== category.CategoryId && 
        c.CategoryName.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setNotification({ type: 'error', message: 'Category already exists!' });
      setTimeout(() => setNotification(null), 1500);
      return;
    }

    // Note: You'll need to implement UpdateCategory action similar to UpdateGarmentType
    setNotification({ type: 'info', message: 'Update functionality to be implemented' });
    setTimeout(() => setNotification(null), 1500);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  // Get row styling
  const getRowClass = () => {
    return 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30 border-l-4 border-l-blue-400';
  };

  // Pagination logic with descending order
  const filteredCategories = categories
    .filter((c) =>
      (c.CategoryName || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by CategoryId in descending order (newest first)
      return parseInt(b.CategoryId) - parseInt(a.CategoryId);
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Pagination 3-page sliding window
  const pageNumbers = [];
  const maxPageButtons = 3;
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  // Loading state
  const isLoading = loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 md:p-6 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
      {/* 3D Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-[100] p-4 rounded-2xl shadow-2xl flex items-center transition-all duration-500 transform ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-blue-200/50 border-l-4 border-l-blue-400' 
              : notification.type === 'error'
              ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400'
              : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-blue-200/50 border-l-4 border-l-blue-400'
          } animate-bounce-in`}
          role="alert"
        >
          <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
            {notification.type === 'success' ? (
              <FiCheckCircle className="text-white" size={18} />
            ) : notification.type === 'error' ? (
              <FiAlertCircle className="text-white" size={18} />
            ) : (
              <FiCheckCircle className="text-white" size={18} />
            )}
          </div>
          <span className="font-semibold text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header Section with 3D Effect */}
      <div className="relative z-10 mb-6 md:mb-8">
        <div className="flex items-center space-x-4 mb-3">
          <div className="p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
            <FiLayers className="text-white text-lg md:text-xl" />
          </div>
          <div className="transform ">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Categories
            </h1>
            <p className="text-slate-600 mt-1 text-sm md:text-base">Manage your rental cloth categories</p>
          </div>
        </div>
      </div>

      {/* Search + Add button - 3D Design */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row flex-grow space-y-4 md:space-y-0 md:space-x-4 w-full">
          <div className="relative flex-grow group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
              disabled={isLoading}
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 md:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 w-full md:w-auto"
          >
            <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
            <FiPlus className="mr-2 relative z-10" size={18} /> 
            <span className="relative z-10">Add Category</span>
          </button>
        </div>
      </div>

      {/* 3D Table */}
      {isLoading ? (
        <div className="relative z-10 text-center py-8 md:py-12">
          <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-2xl border border-white/20">
            <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-blue-800"></div>
            <span className="text-slate-700 font-medium text-sm md:text-base">Loading categories...</span>
          </div>
        </div>
      ) : (
        <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                  <th className="py-3 md:py-4 px-4 md:px-6 text-left text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Category ID</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 text-left text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Category Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {currentCategories.length > 0 ? (
                  currentCategories.map((c, i) => {
                    const rowClass = getRowClass();
                    
                    return (
                      <tr key={c.CategoryId || i} className={`${rowClass} group`}>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base font-medium">
                          {c.CategoryId || 'N/A'}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                          {editingId === c.CategoryId ? (
                            <div className="flex items-center space-x-2 md:space-x-3">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1 px-2 md:px-3 py-1 md:py-2 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm shadow-inner text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(c)}
                              />
                              <div className="flex space-x-1 md:space-x-2">
                                <button
                                  onClick={() => handleSaveEdit(c)}
                                  className="p-1 md:p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                                  title="Save"
                                >
                                  <FiSave size={12} />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 md:p-2 bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                                  title="Cancel"
                                >
                                  <FiX size={12} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span 
                                className="text-slate-800 text-sm md:text-base cursor-pointer hover:text-slate-900 transition-colors duration-200"
                                onClick={() => handleEditClick(c)}
                                title="Click to edit"
                              >
                                {c.CategoryName}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-8 md:py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="p-3 md:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                          <FiLayers className="text-slate-500 text-lg md:text-xl" />
                        </div>
                        <p className="text-slate-500 font-medium">
                          {search ? 'No categories match your search' : 'No categories found'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 3D Pagination */}
          {filteredCategories.length > itemsPerPage && (
            <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-4 md:space-y-0">
              <div className="text-sm text-slate-600">
                Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredCategories.length)} of{' '}
                {filteredCategories.length}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <FiChevronLeft size={14} />
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 md:px-3.5 py-1 md:py-1.5 rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-sm ${
                      currentPage === page
                        ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormError('');
                  setCategoryName('');
                }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
              >
                <FiX className="text-lg md:text-xl" />
              </button>

              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                  <FiPlus className="text-white text-base md:text-lg" />
                </div>
                <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Add Category
                </h2>
              </div>

              {formError && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 text-rose-700 bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl border border-rose-200 shadow-inner text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-slate-700 mb-2">
                    Category Name <span className="text-rose-500"></span>
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => {
                      setCategoryName(e.target.value);
                      if (formError) setFormError('');
                    }}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    placeholder="e.g., Formal, Casual, Traditional"
                  />
                </div>

                <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormError('');
                      setCategoryName('');
                    }}
                    className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm md:text-base order-1 md:order-2"
                  >
                    {adding ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save Category'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;