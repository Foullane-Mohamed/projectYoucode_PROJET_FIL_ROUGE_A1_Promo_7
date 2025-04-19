import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Grid,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  LocalAtm as CashIcon,
} from '@mui/icons-material';

const PaymentMethod = ({ selectedMethod, setSelectedMethod, onNext, onBack }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [errors, setErrors] = useState({});

  const validateCardDetails = () => {
    const newErrors = {};
    
    // Only validate card details if credit card is selected
    if (selectedMethod === 'credit_card') {
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (!cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardExpiry)) {
        newErrors.cardExpiry = 'Use format MM/YY';
      }
      
      if (!cardCVC.trim()) {
        newErrors.cardCVC = 'CVC is required';
      } else if (!/^\d{3,4}$/.test(cardCVC)) {
        newErrors.cardCVC = 'Invalid CVC';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCardDetails()) {
      // Create payment details object based on selected method
      let paymentDetails = { method: selectedMethod };
      
      if (selectedMethod === 'credit_card') {
        paymentDetails = {
          ...paymentDetails,
          card_number: cardNumber.replace(/\s/g, ''),
          card_name: cardName,
          card_expiry: cardExpiry,
          card_cvc: cardCVC
        };
      }
      
      onNext(paymentDetails);
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add a space after every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += digits[i];
    }
    
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    } else {
      return digits;
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <RadioGroup
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
        >
          <FormControlLabel
            value="credit_card"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCardIcon sx={{ mr: 1 }} />
                <Typography>Credit/Debit Card</Typography>
              </Box>
            }
          />
          
          {selectedMethod === 'credit_card' && (
            <Box sx={{ pl: 4, pr: 2, pt: 2, pb: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    error={!!errors.cardNumber}
                    helperText={errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    inputProps={{ maxLength: 19 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name on Card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    error={!!errors.cardName}
                    helperText={errors.cardName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiryDate(e.target.value))}
                    error={!!errors.cardExpiry}
                    helperText={errors.cardExpiry}
                    placeholder="MM/YY"
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVC"
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    error={!!errors.cardCVC}
                    helperText={errors.cardCVC}
                    inputProps={{ maxLength: 4 }}
                  />
                </Grid>
              </Grid>
              <Alert severity="info" sx={{ mt: 2, mb: 1 }}>
                This is a demo application. No real payments will be processed.
              </Alert>
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <FormControlLabel
            value="bank_transfer"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BankIcon sx={{ mr: 1 }} />
                <Typography>Bank Transfer</Typography>
              </Box>
            }
          />
          
          {selectedMethod === 'bank_transfer' && (
            <Box sx={{ pl: 4, pr: 2, pt: 1 }}>
              <Alert severity="info" sx={{ mb: 1 }}>
                You will receive bank account details to complete the transfer after placing your order.
              </Alert>
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
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
              <Alert severity="info" sx={{ mb: 1 }}>
                Pay with cash upon delivery. Additional fee may apply.
              </Alert>
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
          disabled={!selectedMethod}
        >
          Review Order
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentMethod;