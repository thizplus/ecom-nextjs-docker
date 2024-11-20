// components/OrderReport.tsx
import { useState, useCallback, useEffect } from 'react';

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import useOrderReport from '@/actions/backend/orders/useOrderReport';
import PickersRange from './PickersRange';
import formatThaiDateTime from '@/components/global/functions/formatThaiDateTime';


const OrderReport = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), new Date()]);

  const handleDateChange = useCallback((dates: [Date | null, Date | null]) => {
    setDateRange(dates);
  }, []);

  const { data, isLoading, error, refetch } = useOrderReport(dateRange[0], dateRange[1]);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      refetch();
    }
  }, [dateRange, refetch]);

  // Format number with commas and decimals
  const formatNumber = (num: number) => {
    return num.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Format date to Thai locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);


    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  if (error) {
    return (
      <Card sx={{ p: 3, bgcolor: 'error.light' }}>
        <Typography color="error" variant="body1">
          เกิดข้อผิดพลาด: {error instanceof Error ? error.message : 'Unknown error'}
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Date Picker Section */}
        <Grid item xs={12}>
          <PickersRange
            value={dateRange}
            onChange={handleDateChange}
          />
        </Grid>

        {isLoading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : data ? (
          <>
            {/* Summary Cards */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ pb: 1, borderColor: 'divider' }}>
                    สรุปรวมทั้งหมด
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">จำนวนออเดอร์</Typography>
                        <Typography variant="h4">{data.summary.totalOrders}</Typography>
                        <Typography variant="caption" color="textSecondary">รายการ</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">ค่าจัดส่งรวม</Typography>
                        <Typography variant="h4">{formatNumber(data.summary.totalShippingCost)}</Typography>
                        <Typography variant="caption" color="textSecondary">บาท</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">ยอดสินค้ารวม</Typography>
                        <Typography variant="h4">{formatNumber(data.summary.totalAmount)}</Typography>
                        <Typography variant="caption" color="textSecondary">บาท</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">ยอดรวมสุทธิ</Typography>
                        <Typography variant="h4" color="primary">{formatNumber(data.summary.totalNetAmount)}</Typography>
                        <Typography variant="caption" color="textSecondary">บาท</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">ยอดโอนจริง</Typography>
                        <Typography variant="h4" color="success.dark">{formatNumber(data.summary.totalPaymentAmount)}</Typography>
                        <Typography variant="caption" color="textSecondary">บาท</Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Daily Reports */}
            <Grid item xs={12}>
              {data.dailyReports.map((daily) => (
                <Accordion key={daily.date} defaultExpanded={true}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {formatDate(daily.date)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography color="textSecondary">
                          จำนวนออเดอร์: {daily.summary.totalOrders} รายการ
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography color="primary">
                          ยอดขาย: {formatNumber(daily.summary.totalNetAmount)} บาท
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>วันที่สั่งซื้อ</TableCell>
                            <TableCell>เลขที่คำสั่งซื้อ</TableCell>
                            <TableCell>ลูกค้า</TableCell>
                            <TableCell align="right">ค่าส่ง</TableCell>
                            <TableCell align="right">ยอดสินค้า</TableCell>
                            <TableCell align="right">ยอดรวม</TableCell>
                            <TableCell align="right">ยอดโอนจริง</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {daily.orders.map((order) => (
                            <TableRow key={order.orderId} hover>
                              <TableCell>{formatThaiDateTime(order.createdAt)}</TableCell>
                              <TableCell>{order.orderId}</TableCell>
                              <TableCell>{order.customerName}</TableCell>
                              <TableCell align="right">{formatNumber(order.shippingCost)}</TableCell>
                              <TableCell align="right">{formatNumber(order.totalAmount)}</TableCell>
                              <TableCell align="right">{formatNumber(order.netTotal)}</TableCell>
                              <TableCell align="right">{formatNumber(order.payment.amount)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow
                            sx={{
                              '& td': {
                                fontWeight: 'bold',
                                backgroundColor: 'action.selected'
                              }
                            }}
                          >
                            <TableCell colSpan={3}>รวมประจำวัน</TableCell>
                            <TableCell align="right">{formatNumber(daily.summary.totalShippingCost)}</TableCell>
                            <TableCell align="right">{formatNumber(daily.summary.totalAmount)}</TableCell>
                            <TableCell align="right">{formatNumber(daily.summary.totalNetAmount)}</TableCell>
                            <TableCell align="right">{formatNumber(daily.summary.totalPaymentAmount)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </>
        ) : null}
      </Grid>
    </Box>
  );
};

export default OrderReport;
