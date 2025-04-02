export const validateRegisterForm = (inputLogin) => {
  const newError = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+1|1)?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!inputLogin.email) newError.email = "Email is required*";
  if (!emailRegex.test(inputLogin.email))
    newError.email = "Invalid email format";
  if (!inputLogin.password) newError.password = "Password is required*";
  if (!passwordRegex.test(inputLogin.password))
    newError.password =
      "Password must be at least 8 characters include uppercase letter, lowercase letter, one digit, and one special character";
  if (!inputLogin.phoneNumber) newError.phoneNumber = "Phone is required*";
  if (!phoneRegex.test(inputLogin.phoneNumber))
    newError.phoneNumber = "Invalid Phone no";
  if (!inputLogin.firstName) newError.firstName = "Name is required *";
  if (!inputLogin.lastName) newError.lastName = "Name is required *";
  if (inputLogin.password !== inputLogin.cPassword)
    newError.cPassword = "Invalid Password";
  return newError;
};

export const validateLoginForm = (inputLogin) => {
  const newError = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
  if (!emailRegex.test(inputLogin.email))
    newError.email = "Invalid email format";
  if (!inputLogin.email) newError.email = "Email is required*";
  if (!inputLogin.password) newError.password = "Password is required*";
  if (!passwordRegex.test(inputLogin.password))
    newError.password = "Incorrect Password";
  return newError;
};

export const validateProductForm = (inputField) => {
  const newError = {};
  
  if (!inputField.productName) newError.productName = "is required*";
  if (!inputField.description) newError.description = "is required*";
  if (!inputField.category) newError.category = "is required*";
  if (!inputField.brand) newError.brand = "is required*";
  if (!inputField.roomType) newError.roomType = "is required*";
  
  if (!inputField.materials || inputField.materials.length === 0) {
    newError.materials = "At least one material is required*";
  }
  
  if (!inputField.colors || inputField.colors.length === 0) {
    newError.colors = "At least one color is required*";
  }

  if (!inputField.dimensions) {
    newError.dimensions = "Dimensions are required*";
  } else {
    if (!inputField.dimensions.length) newError["dimensions.length"] = "Length is required*";
    if (!inputField.dimensions.width) newError["dimensions.width"] = "Width is required*";
    if (!inputField.dimensions.height) newError["dimensions.height"] = "Height is required*";
  }
  
  if (!inputField.stock) {
    newError.stock = "is required*";
  } else if (inputField.stock < 0) {
    newError.stock = "cannot be negative";
  }
  
  if (!inputField.regularPrice) {
    newError.regularPrice = "is required*";
  } else if (inputField.regularPrice < 0) {
    newError.regularPrice = "cannot be negative";
  }

  if (!inputField.salePrice) {
    newError.salePrice = "is required*";
  } else if (inputField.salePrice < 0) {
    newError.salePrice = "cannot be negative";
  }

  if (!inputField.warranty) {
    newError.warranty = "is required*";
  }

  return newError;
};

export const validateAddressForm = (formData) => {
  const errors = {};

  const phoneRegex = /^\d{10}$/;
  const pinCodeRegex = /^\d{6}$/;

  if (!formData.customerName) errors.customerName = "Name is required*";
  if (!formData.phone) errors.phone = "Phone number is required*";
  if (!phoneRegex.test(formData.phone)) errors.phone = "Invalid phone number format*";
  if (!formData.pinCode) errors.pinCode = "Pin code is required*";
  if (!pinCodeRegex.test(formData.pinCode)) errors.pinCode = "Invalid pin code format*";
  if (!formData.address) errors.address = "Address is required*";
  if (!formData.locality) errors.locality = "Locality is required*";
  if (!formData.city) errors.city = "City is required*";
  if (!formData.state) errors.state = "State is required*";

  return errors;
};

export const validateCouponForm = (formData) => {
  const errors = {};

  const minPurchaseAmount = parseFloat(formData.minPurchaseAmount);
  const maxDiscountAmount = parseFloat(formData.maxDiscountAmount);

  if (!formData.couponName) errors.couponName = "Coupon name is required*";
  if (!formData.couponCode) errors.couponCode = "Coupon code is required*";
  if (!formData.startDate) errors.startDate = "Starting date is required*";
  if (!formData.endDate) errors.endDate = "Ending date is required*";
  if (!formData.discount) errors.discount = "Discount is required*";
  if (isNaN(formData.discount) || formData.discount <= 0 || formData.discount > 100)
    errors.discount = "Discount must be a percentage between 1 and 100*";
  if (!formData.minPurchaseAmount) errors.minPurchaseAmount = "Minimum purchase amount is required*";
  if (isNaN(minPurchaseAmount) || minPurchaseAmount < 0) errors.minPurchaseAmount = "Minimum purchase amount must be a positive number*";
  if (!formData.maxDiscountAmount) errors.maxDiscountAmount = "Maximum purchase amount is required*";
  if (isNaN(maxDiscountAmount) || maxDiscountAmount < 0) errors.maxDiscountAmount = "Maximum purchase amount must be a positive number*";
  if (maxDiscountAmount > minPurchaseAmount) errors.maxDiscountAmount = "Maximum purchase amount must be less than the minimum purchase amount*";

  return errors;
};

