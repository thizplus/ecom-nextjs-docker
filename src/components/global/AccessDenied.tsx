// components/global/AccessDenied.tsx

import { Box, Typography } from '@mui/material';

const AccessDenied = () => {


  return (
    <Box
      className="flex flex-col items-center justify-center min-h-screen p-4"
      sx={{ textAlign: 'center' }}
    >
      <Typography variant="h5" gutterBottom>
        ไม่มีสิทธิ์เข้าถึง
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        คุณไม่มีสิทธิ์เข้าถึงราคานี้ กรุณาติดต่อผู้ดูแลระบบ
      </Typography>

    </Box>
  );
};

export default AccessDenied;
