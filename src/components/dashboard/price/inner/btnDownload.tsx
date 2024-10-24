import { useState } from "react";

import Button from "@mui/material/Button"
import DownloadIcon from '@mui/icons-material/Download';

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import actionDownloadPriceCSV from "@/actions/backend/price/inner/downloadPriceCSV";

type propsDownload = {
  priceId: string;
  priceName: string;
}



const BtnDownload = ({ priceId, priceName }: propsDownload) => {

  const [isProcess, setIsProcess] = useState<boolean>(false)

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })


  const handleDownload = async () => {
    setIsProcess(true);

    try {
      await actionDownloadPriceCSV({ priceId, priceName });
      setSnackbar({ open: true, message: 'Download .CSV completed successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Download .CSV failed', severity: 'error' });
    } finally {
      setIsProcess(false);
    }

  }

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<DownloadIcon />}
        color="secondary"
        onClick={handleDownload}
        fullWidth
        disabled={isProcess}>
        {isProcess ? 'กำลังดาวน์โหลด...' : 'ดาวโหลด .CSV'}



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
            boxShadow: 3, // เพิ่มเงา
            borderRadius: 2 // ปรับความโค้งของมุม
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>



  )
}

export default BtnDownload
