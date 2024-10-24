import React, { useEffect, useState, useCallback, useRef } from 'react';

import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import type { SelectChangeEvent } from '@mui/material';
import { Pagination, TextField, Select, MenuItem } from '@mui/material';

import Loading from '@/components/global/Loading';
import actionFetchCategories from '@/actions/backend/category/fetchCategories';
import scrollToTop from '@/components/global/functions/scrollToTop';
import MultiPriceAddToCart from './MultiPriceAddToCart';
import { formatNumber } from '@/components/global/functions/numberFormat';
import type { MultiPriceProduct } from '@/types/multiplePrice';
import { useMultiPriceCartStore } from '@/stores/multiCartStore';

interface ProductsResponse {
  items: MultiPriceProduct[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface Props {
  priceIds: string[];
}

const MultiPriceProductList: React.FC<Props> = ({ priceIds }) => {
  const socketRef = useRef<Socket | null>(null);
  const [products, setProducts] = useState<MultiPriceProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<Array<{ id: string, name: string }>>([]);

  const { updateAvailableStock, updateItemPrice, items } = useMultiPriceCartStore();

  const updateCartPrices = useCallback((updatedProducts: MultiPriceProduct[]) => {
    updatedProducts.forEach(product => {
      const cartItem = items.find(item => item.sku === product.sku);

      if (cartItem) {
        const newPrices = product.prices.reduce((acc, price) => ({
          ...acc,
          [price.priceId]: price.price
        }), {});

        updateItemPrice(product.sku, newPrices);
      }
    });
  }, [items, updateItemPrice]);

  const requestProducts = useCallback((page: number, search: string, category: string) => {
    if (socketRef.current) {
      setIsLoading(true);
      socketRef.current.emit('requestMultiPriceProducts', {
        page,
        limit: 20,
        searchTerm: search,
        selectedCategory: category,
      });
    }
  }, []);

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
    const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, {
      query: { priceIds: priceIds.join(',') }
    });

    socketRef.current = socket;

    const handleProductsList = (data: ProductsResponse) => {
      setProducts(data.items);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setIsLoading(false);
      updateCartPrices(data.items);
    };

    const handleProductUpdate = (updatedProduct: MultiPriceProduct) => {
      setProducts(prevProducts => {
        const newProducts = prevProducts.map(product =>
          product.sku === updatedProduct.sku ? { ...product, ...updatedProduct } : product
        );

        updateCartPrices([updatedProduct]);

        return newProducts;
      });
      updateAvailableStock(updatedProduct.sku, updatedProduct.availablestock);
    };

    socket.on('connect', () => {
      setError(null);
      requestProducts(currentPage, searchTerm, selectedCategory);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to server');
      setIsLoading(false);
    });

    socket.on('multiPriceProductsList', handleProductsList);
    socket.on('multiPriceProductUpdate', handleProductUpdate);
    socket.on('error', (errorMsg: string) => {
      console.error('Socket error:', errorMsg);
      setError(`Server error: ${errorMsg}`);
    });

    return () => {
      socket.off('multiPriceProductsList', handleProductsList);
      socket.off('multiPriceProductUpdate', handleProductUpdate);
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceIds]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    scrollToTop(800);
    requestProducts(value, searchTerm, selectedCategory);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const newCategory = event.target.value;

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
              <div key={product.id} className="border p-4 rounded">
                {product.imagepath && (
                  <img src={product.imagepath} alt={product.name} className="w-full h-40 object-cover mb-2" />
                )}
                <div className='flex justify-between mb-1'>
                  <p className='text-sm font-semibold'>{product.sku}</p>
                  <p className='text-sm'>เหลือ: {formatNumber(product.availablestock)}</p>
                </div>
                <h2 className="font-bold text-lg mb-2">{product.name}</h2>
                {product.prices.map((price) => (
                  <div key={price.priceId} className="mb-1">
                    <p className="text-sm leading-none flex justify-between border-b-[1px] border-dashed">
                      {price.priceName}: <strong>{formatNumber(price.price)}฿</strong>
                    </p>
                  </div>
                ))}
                <div className="mt-2">
                  <MultiPriceAddToCart product={product} />
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-center mt-4">ไม่พบสินค้า</p>
          )}

          <div className="mt-4 flex justify-center">
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

export default MultiPriceProductList;
