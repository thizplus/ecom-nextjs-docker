// components/dashboard/price/PriceUsersManager.tsx
import React, { useState, useEffect } from 'react';

import {
  Autocomplete,
  TextField,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';

import { useSearchClients } from '@/actions/backend/price/useSearchClients';
import { useUpdatePriceUsers } from '@/actions/backend/price/useUpdatePriceUsers';
import { useBulkUsers } from '@/actions/backend/price/useBulkUsers';

interface User {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

interface Props {
  priceId: string;
  priceName: string;
  initialUsers?: string[];
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export const PriceUsersManager: React.FC<Props> = ({
  priceId,
  initialUsers = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Custom hooks
  const { data: searchResults, isLoading: isSearching } = useSearchClients(searchTerm);
  const { data: initialUserData, isLoading: isLoadingInitial } = useBulkUsers(initialUsers);
  const updateUsersMutation = useUpdatePriceUsers(priceId);

  // Load initial users
  useEffect(() => {
    if (initialUserData) {
      setSelectedUsers(initialUserData);
    }
  }, [initialUserData]);

  // Handle users change with auto-save
  const handleUsersChange = async (newUsers: User[]) => {
    setSelectedUsers(newUsers);

    try {
      await updateUsersMutation.mutateAsync(newUsers.map(u => u.userId));
      setSnackbar({
        open: true,
        message: 'บันทึกข้อมูลสำเร็จ',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating users:', error);
      setSnackbar({
        open: true,
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Loading state
  if (isLoadingInitial) {
    return (
      <Box className="flex justify-center p-4">
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <>
      {selectedUsers.length > 0 && (
        <p>  จำนวนผู้ใช้ที่มีสิทธิ์เข้าถึง: {selectedUsers.length} คน</p>
      )}


      <Autocomplete
        multiple
        value={selectedUsers}
        onChange={(_, newValue) => handleUsersChange(newValue)}
        options={searchResults || []}
        getOptionLabel={(option) => `${option.displayName} (${option.userId})`}
        loading={isSearching || updateUsersMutation.isPending}
        filterSelectedOptions
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            label="ค้นหาและเลือกผู้ใช้"
            placeholder="พิมพ์เพื่อค้นหาผู้ใช้..."
            onChange={(e) => setSearchTerm(e.target.value)}
            helperText={
              updateUsersMutation.isPending
                ? "กำลังบันทึกการเปลี่ยนแปลง..."
                : "การเปลี่ยนแปลงจะถูกบันทึกอัตโนมัติ"
            }
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {(isSearching || updateUsersMutation.isPending) && (
                    <CircularProgress color="inherit" size={20} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { key, ...tagProps } = getTagProps({ index });


            return (
              <Chip
                {...tagProps}
                key={`user-${option.userId}-${index}`}
                label={option.displayName}
                avatar={
                  option.pictureUrl ? (
                    <img
                      src={option.pictureUrl}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                  ) : undefined
                }
              />
            );
          })
        }
        isOptionEqualToValue={(option, value) => option.userId === value.userId}
        className="min-w-[300px]"
      />



      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PriceUsersManager;
