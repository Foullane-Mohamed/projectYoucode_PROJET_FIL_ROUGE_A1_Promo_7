import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
} from '@mui/material';
import {
  LocalAtm as CashIcon,
} from '@mui/icons-material';

const PaymentMethod = ({ selectedMethod, setSelectedMethod, onNext, onBack }) => {
  const handleNext = () => {
    // Create payment details object based on selected method
    const paymentDetails = { method: selectedMethod };
    onNext(paymentDetails);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Select Payment Method
        </Typography>
        
        <RadioGroup
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
        >
          <FormControlLabel
            value="cash_on_delivery"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CashIcon sx={{ mr: 1 }} />
                <Typography>Cash on Delivery</Typography>
              </Box>
            }
          />
          
          {selectedMethod === 'cash_on_delivery' && (
            <Box sx={{ pl: 4, pr: 2, pt: 1 }}>
            </Box>
          )}
        </RadioGroup>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack} variant="outlined">
          Back to Shipping
        </Button>
        <Button 
          onClick={handleNext} 
          variant="contained" 
          color="primary"
        >
          Review Order
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentMethod;