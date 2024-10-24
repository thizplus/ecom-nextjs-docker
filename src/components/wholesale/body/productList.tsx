'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react';

import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import type { SelectChangeEvent } from '@mui/material';
import { Pagination, TextField, Select, MenuItem } from '@mui/material';

import Loading from '@/components/global/Loading';
import actionFetchCategories from '@/actions/backend/category/fetchCategories';
import scrollToTop from '@/components/global/functions/scrollToTop';
import AddToCart from './addToCart';
import { formatNumber } from '@/components/global/functions/numberFormat';
import type { TypesProductWholesale } from '@/types/productTypes';
import { useCartStore } from '@/stores/cartStore';

interface ProductsResponse {
  items: TypesProductWholesale[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

type propsPrice = {
  priceId: string;
}

const ProductList: React.FC<propsPrice> = ({ priceId }) => {
  const socketRef = useRef<Socket | null>(null);
  const [products, setProducts] = useState<TypesProductWholesale[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<Array<{ id: string, name: string }>>([]);

  const updateAvailableStock = useCartStore(state => state.updateAvailableStock);

  const requestProducts = useCallback((page: number, search: string, category: string) => {
    if (socketRef.current) {
      setIsLoading(true);
      socketRef.current.emit('requestWholesaleProducts', {
        page,
        limit: 20,
        searchTerm: search,
        selectedCategory: category,
        priceId
      });
    }
  }, [priceId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await actionFetchCategories(1, 100);

        setCategories(data.items.map((category: any) => ({
          id: category.id,
          name: category.name
        })));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("Setting up socket connection...");

    const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/wholesale`, {
      query: { priceId }
    });

    socketRef.current = socket;

    const handleConnect = () => {
      console.log('Connected to products namespace');
      setError(null);
      requestProducts(currentPage, searchTerm, selectedCategory);
    };

    const handleProductsList = (data: ProductsResponse) => {
      console.log('Received products data:', data);
      setProducts(data.items);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setIsLoading(false);
    };

    const handleProductUpdate = (updatedProduct: TypesProductWholesale) => {
      console.log('Received product update:', updatedProduct);
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.sku === updatedProduct.sku ? { ...product, ...updatedProduct } : product
        )
      );
      updateAvailableStock(priceId, updatedProduct.sku, updatedProduct.availablestock);
    };

    const handleError = (err: Error | string) => {
      console.error('Socket error:', err);
      setError(typeof err === 'string' ? err : 'Failed to connect to server');
      setIsLoading(false);
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleError);
    socket.on('wholesaleProductsList', handleProductsList);
    socket.on('wholesaleProductUpdate', handleProductUpdate);
    socket.on('error', handleError);

    return () => {
      console.log("Cleaning up socket connection...");
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleError);
      socket.off('wholesaleProductsList', handleProductsList);
      socket.off('wholesaleProductUpdate', handleProductUpdate);
      socket.off('error', handleError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [priceId, currentPage, searchTerm, selectedCategory, requestProducts, updateAvailableStock]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    scrollToTop(800);
    requestProducts(value, searchTerm, selectedCategory);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const newCategory = event.target.value;

    console.log('Changing category to:', newCategory);
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    requestProducts(1, searchTerm, newCategory);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;

    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
    requestProducts(1, newSearchTerm, selectedCategory);
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <TextField
          label="ค้นหาสินค้า..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          className="mr-2"
          size="small"
        />
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          variant="outlined"
          fullWidth
          size='small'
        >
          <MenuItem value="">แสดงทั้งหมด</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded grid">
                {product.imagepath && (
                  <img src={product.imagepath} alt={product.name} className="mt-2 w-full h-40 object-cover" />
                )}
                <div className='flex justify-between mb-1'>
                  <p className='text-sm'>{product.sku}</p>
                  <p className='text-sm'>เหลือ: {formatNumber(product.availablestock)}</p>
                </div>
                <h2 className="font-semibold text-sm leading-none mb-1">{product.name}</h2>
                <p className="text-sm mt-1">ราคา: {product.price !== null ? `${formatNumber(product.price)} บาท` : 'ไม่มีข้อมูล'}</p>
                <AddToCart items={product} priceId={priceId} />
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-center mt-4">ไม่พบสินค้า</p>
          )}

          <div className="mt-4 flex justify-center items-center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
