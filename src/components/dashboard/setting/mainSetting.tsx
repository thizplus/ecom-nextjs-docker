'use client'

import { useEffect, useState } from 'react'
import type { SyntheticEvent } from 'react'

import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useQueryClient } from '@tanstack/react-query'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

import useStoreConfig from '@/actions/backend/setting/useStoreConfig'
import usePriceAll from '@/actions/backend/price/usePriceAll'
import type { StoreConfig, ListPrice, LineNotificationConfig, SlipOKConfig, LineMessageConfig } from '@/types/storeConfigTypes'
import actionUpdateConfig from '@/actions/backend/setting/updateStoreConfig'
import { formatNumber } from '@/components/global/functions/numberFormat'
import type { TypePrice } from '@/types/priceTypes'

const MainSetting = () => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState<string>('1');
  const { data: storeConfig, status: configStatus, error: configError } = useStoreConfig();
  const { data: priceData, status: priceStatus, error: priceError } = usePriceAll(1, 100);
  const [config, setConfig] = useState<StoreConfig | undefined>(undefined);
  const [isProcess, setIsProcess] = useState<boolean>(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (storeConfig) {
      setConfig(storeConfig);
    }
  }, [storeConfig]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleInputChange = (field: keyof StoreConfig, value: any) => {
    if (!config) return;

    setConfig({
      ...config,
      [field]: {
        ...config[field],
        ...value,
      },
    });
  };

  const handleLineNotificationChange = (field: keyof LineNotificationConfig, value: any) => {
    if (!config) return;
    setConfig({
      ...config,
      lineNotification: {
        ...config.lineNotification,
        [field]: value,
      },
    });
  };

  const handleLineMessageChange = (field: keyof LineMessageConfig, value: any) => {
    if (!config) return;
    setConfig({
      ...config,
      lineMessage: {
        ...config.lineMessage,
        [field]: value,
      },
    });
  };

  const handleSlipOKChange = (field: keyof SlipOKConfig, value: any) => {
    if (!config) return;
    setConfig({
      ...config,
      slipOK: {
        ...config.slipOK,
        [field]: value,
      },
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUpdate = async () => {
    if (!config) return;

    setIsProcess(true);

    const updatedConfig = {
      ...config,
      saleModel: {
        ...config.saleModel,
        minOrderStatus: config.saleModel.minOrderStatus ?? false,
        minOrderValue: config.saleModel.minOrderValue ?? 0,
      }
    };

    try {
      await actionUpdateConfig({ config: updatedConfig });
      setSnackbar({ open: true, message: 'Configuration updated successfully', severity: 'success' });
      queryClient.invalidateQueries({ queryKey: ['StoreConfig'] });
    } catch (error) {
      setSnackbar({ open: true, message: error instanceof Error ? error.message : 'Failed to update configuration', severity: 'error' });
    } finally {
      setIsProcess(false);
    }
  };

  const handleSaleModelTypeChange = (event: SelectChangeEvent<'single' | 'multiple'>) => {
    const newType = event.target.value as 'single' | 'multiple';

    if (config) {
      setConfig({
        ...config,
        saleModel: {
          ...config.saleModel,
          type: newType,
          listPrice: newType === 'single' ? [{ id: '', name: '', minPurchase: 0, LIFF_ID: '' }] : []
        }
      });
    }
  };

  const handleAddPrice = () => {
    if (config && config.saleModel.type === 'multiple') {
      const newPrice: ListPrice = { id: '', name: '', minPurchase: 0, LIFF_ID: '' };

      setConfig({
        ...config,
        saleModel: {
          ...config.saleModel,
          listPrice: [...config.saleModel.listPrice, newPrice]
        }
      });
    }
  };

  const handleRemovePrice = (index: number) => {
    if (config && config.saleModel.type === 'multiple') {
      const newPrices = config.saleModel.listPrice.filter((_, i) => i !== index);

      setConfig({
        ...config,
        saleModel: {
          ...config.saleModel,
          listPrice: newPrices
        }
      });
    }
  };

  const handlePriceChange = (index: number, field: keyof ListPrice, value: any) => {
    if (config) {
      const newPrices = [...config.saleModel.listPrice];

      newPrices[index] = { ...newPrices[index], [field]: value };

      if (field === 'id') {
        const selectedPrice = priceData?.items.find((price: TypePrice) => price._id === value);

        if (selectedPrice) {
          newPrices[index].name = selectedPrice.name;
        }
      }

      setConfig({
        ...config,
        saleModel: {
          ...config.saleModel,
          listPrice: newPrices
        }
      });
    }
  };

  const handleSaleModelChange = (field: keyof StoreConfig['saleModel'], value: any) => {
    if (!config) return;

    setConfig({
      ...config,
      saleModel: {
        ...config.saleModel,
        [field]: value,
      },
    });
  };

  if (configStatus === 'pending' || priceStatus === 'pending') {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (configStatus === 'error' || priceStatus === 'error') {
    return (
      <div className="text-center text-red-500">
        <p>An error occurred while loading the data.</p>
        <p>{configError instanceof Error ? configError.message : 'Unknown error'}</p>
        <p>{priceError instanceof Error ? priceError.message : 'Unknown error'}</p>
      </div>
    );
  }

  if (!config || !priceData) {
    return <div className="text-center">No data found.</div>;
  }

  return (
    <>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label='store configuration tabs'>
          <Tab value='1' label='LINE LOGIN' />
          <Tab value='2' label='LINE NOTIFICATION' />
          <Tab value='3' label='LINE MESSAGE' />
          <Tab value='4' label='SLIP OK' />
          <Tab value='5' label='รูปแบบการขาย' />
          <Tab value='6' label='ค่าจัดส่ง' />
        </TabList>

        {/* Line Login Config */}
        <TabPanel value='1' className='max-w-xs'>
          <Typography variant="h6" className='mb-4'>LINE LOGIN Configuration</Typography>


          <TextField
            label="LINE LIFF ID"
            variant="outlined"
            fullWidth
            className='mb-4'
            size="small"
            value={config.lineLogin?.LINE_LIFF_ID || ''}
            onChange={(e) => handleInputChange('lineLogin', { LINE_LIFF_ID: e.target.value })}
          />



        </TabPanel>

        {/* Line Notification */}
        <TabPanel value='2' className='max-w-xs'>
          <Typography variant="h6" className='mb-4'>LINE NOTIFICATION Configuration</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={config.lineNotification?.NOTIFY_ENABLED || false}
                onChange={(e) => handleLineNotificationChange('NOTIFY_ENABLED', e.target.checked)}
                color="primary"
              />
            }
            label="เปิดใช้งานการแจ้งเตือน LINE"
            className='mb-4'
          />
          <TextField
            label="LINE NOTIFY TOKEN"
            variant="outlined"
            fullWidth
            size="small"
            value={config.lineNotification?.LINE_NOTIFY_TOKEN || ''}
            onChange={(e) => handleLineNotificationChange('LINE_NOTIFY_TOKEN', e.target.value)}
            disabled={!config.lineNotification?.NOTIFY_ENABLED}
          />
        </TabPanel>

        {/* Line Message Config */}
        <TabPanel value='3' className='max-w-xs'>
          <Typography variant="h6" className='mb-4'>LINE Messaging API Configuration</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={config.lineMessage?.MESSAGE_ENABLED || false}
                onChange={(e) => handleLineMessageChange('MESSAGE_ENABLED', e.target.checked)}
                color="primary"
              />
            }
            label="เปิดใช้งาน LINE Messaging API"
            className='mb-4'
          />
          <TextField
            label="Channel Access Token"
            variant="outlined"
            fullWidth
            size="small"
            className='mb-4'
            value={config.lineMessage?.CHANNEL_ACCESS_TOKEN || ''}
            onChange={(e) => handleLineMessageChange('CHANNEL_ACCESS_TOKEN', e.target.value)}
            disabled={!config.lineMessage?.MESSAGE_ENABLED}
          />
          <TextField
            label="Channel Secret"
            variant="outlined"
            fullWidth
            size="small"
            value={config.lineMessage?.CHANNEL_SECRET || ''}
            onChange={(e) => handleLineMessageChange('CHANNEL_SECRET', e.target.value)}
            disabled={!config.lineMessage?.MESSAGE_ENABLED}
          />
        </TabPanel>

        {/* SlipOK Config */}
        <TabPanel value='4' className='max-w-xs'>
          <Typography variant="h6" className='mb-4'>Slip OK API Configuration</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={config.slipOK?.ENABLED || false}
                onChange={(e) => handleSlipOKChange('ENABLED', e.target.checked)}
                color="primary"
              />
            }
            label="เปิดใช้งาน Slip OK API"
            className='mb-4'
          />
          <TextField
            label="API URL"
            variant="outlined"
            fullWidth
            size="small"
            className='mb-4'
            value={config.slipOK?.API_URL || ''}
            onChange={(e) => handleSlipOKChange('API_URL', e.target.value)}
            disabled={!config.slipOK?.ENABLED}
          />
          <TextField
            label="API Key"
            variant="outlined"
            fullWidth
            size="small"
            value={config.slipOK?.API_KEY || ''}
            onChange={(e) => handleSlipOKChange('API_KEY', e.target.value)}
            disabled={!config.slipOK?.ENABLED}
          />
        </TabPanel>

        {/* Sale Model Config */}
        <TabPanel value='5' className='max-w-xs'>
          <Typography variant="h6" className='mb-4'>Sale Model Configuration</Typography>

          <FormControlLabel
            control={
              <Switch
                checked={config.saleModel.minOrderStatus}
                onChange={(e) => handleSaleModelChange('minOrderStatus', e.target.checked)}
                color="primary"
              />
            }
            label="เปิดใช้งานยอดสั่งซื้อขั้นต่ำ"
            className=''
          />
          {config.saleModel.minOrderStatus && (
            <TextField
              label="ยอดสั่งซื้อขั้นต่ำ"
              variant="outlined"
              type="number"
              fullWidth
              size="small"
              className='mt-2'
              value={config.saleModel.minOrderValue}
              onChange={(e) => handleSaleModelChange('minOrderValue', Number(e.target.value))}
            />
          )}

          <Select
            value={config.saleModel.type}
            onChange={handleSaleModelTypeChange}
            fullWidth
            size='small'
            className='my-4'
          >
            <MenuItem value="single">ราคาเดียว</MenuItem>
            <MenuItem value="multiple">หลายราคา</MenuItem>
          </Select>

          {config.saleModel.type === 'single' ? (
            <Select
              value={config.saleModel.listPrice[0]?.id || ''}
              onChange={(e) => handlePriceChange(0, 'id', e.target.value)}
              fullWidth
              size='small'
            >
              {priceData.items.map((price: TypePrice) => (
                <MenuItem key={price._id} value={price._id}>
                  {price.name}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <>
              {config.saleModel.listPrice.map((price, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Select
                    value={price.id}
                    onChange={(e) => handlePriceChange(index, 'id', e.target.value)}
                    style={{ marginRight: '10px', flexGrow: 1 }}
                    size='small'
                  >
                    {priceData.items.map((priceItem: TypePrice) => (
                      <MenuItem key={priceItem._id} value={priceItem._id}>
                        {priceItem.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    label="ยอดซื้อขั้นต่ำ"
                    variant="outlined"
                    type="number"
                    size='small'
                    value={price.minPurchase}
                    onChange={(e) => handlePriceChange(index, 'minPurchase', Number(e.target.value))}
                    style={{ marginRight: '10px', width: '150px' }}
                  />
                  <IconButton onClick={() => handleRemovePrice(index)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
              <Button startIcon={<AddIcon />} onClick={handleAddPrice}>
                เพิ่มราคา
              </Button>
            </>
          )}


        </TabPanel>

        {/* Shipping Cost Config */}
        <TabPanel value='6' className='max-w-sm'>
          <Typography variant="h6" className='mb-4'>Shipping Cost Configuration</Typography>
          <TextField
            label="เมื่อสั่งซื้อต่ำกว่าหรือเท่ากับ"
            variant="outlined"
            type="number"
            fullWidth
            size="small"
            className='mb-4'
            value={config.shippingCost?.standard.value ?? 0}
            onChange={(e) => handleInputChange('shippingCost', { standard: { ...config.shippingCost?.standard, value: Number(e.target.value) } })}
          />
          <TextField
            label="ค่าจัดส่งมาตรฐาน"
            variant="outlined"
            type="number"
            fullWidth
            size="small"
            className='mb-4'
            value={config.shippingCost?.standard.cost ?? 0}
            onChange={(e) => handleInputChange('shippingCost', { standard: { ...config.shippingCost?.standard, cost: Number(e.target.value) } })}
          />
          {config.shippingCost && (
            <TextField
              label={`หากมากกว่า ${formatNumber(config.shippingCost.standard.value)} = ราคาสินค้าทั้งหมด หารด้วย ${config.shippingCost.special.value}`}
              variant="outlined"
              type="number"
              fullWidth
              size="small"
              className='mb-4'
              value={config.shippingCost.special.value}
              onChange={(e) => handleInputChange('shippingCost', { special: { ...config.shippingCost.special, value: Number(e.target.value) } })}
            />
          )}
          {config.shippingCost && (
            <>
              <p className='text-sm'>ซื้อสินค้า 1 - {formatNumber(config.shippingCost.standard.value)}  : ค่าจัดส่ง = {config.shippingCost.standard.cost} บาท</p>
              <p className='text-sm'>ซื้อสินค้า {formatNumber(config.shippingCost.standard.value)} ขึ้นไป : ค่าจัดส่ง = ราคาสินค้าในตระกร้า / {config.shippingCost.special.value}</p>
              <p className='text-sm'>สมมุติซื้อสินค้า 10,000 บาท : ค่าจัดส่ง = {formatNumber(10000 / config.shippingCost.special.value)} บาท</p>
            </>
          )}
        </TabPanel>
      </TabContext >

      <Button
        onClick={handleUpdate}
        variant='contained'
        color='primary'
        className='mt-4'
        disabled={isProcess}
      >
        {isProcess ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูล'}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MainSetting;
