import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const generateCouponCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const CouponForm = ({ open, onClose, onSubmit, initialValues, isEdit }) => {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const codeInputRef = useRef(null);
  const discountValueInputRef = useRef(null);

  useEffect(() => {
    if (initialValues) {
      setCode(initialValues.code || "");
      setDiscountType(initialValues.discount_type || "percentage");
      setDiscountValue(initialValues.discount_value?.toString() || "");
      setMinPurchase(initialValues.min_order_amount?.toString() || "");
      setMaxDiscount(initialValues.max_discount_amount?.toString() || "");
      setMaxUses(initialValues.usage_limit?.toString() || "");

      if (initialValues.starts_at) {
        const startDateValue = new Date(initialValues.starts_at);
        if (!isNaN(startDateValue.getTime())) {
          setStartDate(startDateValue.toISOString().slice(0, 10));
        }
      }

      if (initialValues.expires_at) {
        const endDateValue = new Date(initialValues.expires_at);
        if (!isNaN(endDateValue.getTime())) {
          setEndDate(endDateValue.toISOString().slice(0, 10));
        }
      }

      setIsActive(!!initialValues.is_active);
    } else {
      setCode("");
      setDiscountType("percentage");
      setDiscountValue("");
      setMinPurchase("");
      setMaxDiscount("");
      setMaxUses("");
      setStartDate(new Date().toISOString().slice(0, 10));
      setEndDate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10)
      );
      setIsActive(true);
    }
  }, [initialValues, open]);

  const handleGenerateCode = () => {
    const newCode = generateCouponCode();
    setCode(newCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const values = {
      code,
      discount_type: discountType,
      discount_value: discountValue !== "" ? parseFloat(discountValue) : 0,
      min_order_amount: minPurchase !== "" ? parseFloat(minPurchase) : null,
      max_discount_amount: maxDiscount !== "" ? parseFloat(maxDiscount) : null,
      usage_limit: maxUses !== "" ? parseInt(maxUses, 10) : null,
      starts_at: startDate ? new Date(startDate) : new Date(),
      expires_at: endDate
        ? new Date(endDate)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      is_active: isActive,
    };

    if (initialValues?.id) {
      values.id = initialValues.id;
    }

    try {
      onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? "Edit Coupon" : "Create New Coupon"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <form id="coupon-form" onSubmit={handleSubmit}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item md={6}>
              <TextField
                fullWidth
                label="Coupon Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputRef={codeInputRef}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleGenerateCode} edge="end">
                        <RefreshIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item md={6}>
              <FormControl fullWidth>
                <InputLabel id="discount-type-label">Discount Type</InputLabel>
                <Select
                  labelId="discount-type-label"
                  id="discount-type"
                  value={discountType}
                  label="Discount Type"
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item md={6}>
              <TextField
                fullWidth
                label={
                  discountType === "percentage"
                    ? "Discount (%)"
                    : "Discount Amount ($)"
                }
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                inputRef={discountValueInputRef}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {discountType === "percentage" ? "%" : "$"}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item md={6}>
              <TextField
                fullWidth
                label="Minimum Purchase"
                type="number"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>

            {discountType === "percentage" && (
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="Maximum Discount"
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}

            <Grid item md={6}>
              <TextField
                fullWidth
                label="Maximum Uses"
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
              />
            </Grid>

            <Grid item md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item md={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item md={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          form="coupon-form"
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !code || !discountValue}
        >
          {isEdit ? "Update Coupon" : "Create Coupon"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CouponForm;
