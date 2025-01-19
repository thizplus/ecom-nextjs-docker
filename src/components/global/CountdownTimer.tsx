import React, { useState, useEffect, useCallback } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface CountdownTimerProps {
  expireTime: Date | string;
  onExpire: () => void;
  isActive?: boolean;
}

interface TimeLeft {
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  expireTime,
  onExpire,
  isActive = true
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    minutes: 15,
    seconds: 0
  });

  const [isExpired, setIsExpired] = useState<boolean>(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();

    const expireDate = typeof expireTime === 'string'
      ? new Date(expireTime).getTime()
      : expireTime.getTime();

    const difference = expireDate - now;

    if (difference <= 0) {
      setIsExpired(true);

      return { minutes: 0, seconds: 0 };
    }

    return {
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }, [expireTime]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();

      setTimeLeft(newTime);

      if (newTime.minutes === 0 && newTime.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, calculateTimeLeft]);

  useEffect(() => {
    if (isExpired) {
      const timer = setTimeout(() => {
        onExpire();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isExpired, onExpire]);

  if (!isActive) return null;

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      {isExpired ? (
        <Paper
          elevation={0}
          sx={{
            p: 1,
            bgcolor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <ErrorOutlineIcon color="error" />
          <Typography color="error">
            หมดเวลาชำระเงิน กรุณาทำรายการใหม่
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Chip
            icon={<AccessTimeIcon />}
            label={
              <Box component="span" sx={{ px: 1 }}>
                <Typography component="span" sx={{ fontSize: '0.9rem' }}>
                  เวลาที่เหลือในการชำระเงิน:{' '}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    color: timeLeft.minutes < 5 ? '#EF4444' : 'inherit'
                  }}
                >
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </Typography>
              </Box>
            }
            sx={{
              py: 2,
              bgcolor: 'background.paper',
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CountdownTimer;
