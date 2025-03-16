const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Registration Details
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },

  // Client Details (Step 1)
  retirementAge: { type: Number },
  lifeExpectancy: { type: Number },

  // Risk Assessment (Step 2)
  riskAssessment: {
    monthlyIncome: { type: Number },
    annualIncomeGrowth: { type: Number },
    monthlyExpenses: { type: Number },
    annualExpenseGrowth: { type: Number },
    inflationRate: { type: Number },
    emiDetails: {
      loanAmount: { type: Number },
      tenure: { type: Number },
      interestRate: { type: Number },
      monthlyEMI: { type: Number }
    }
  },

  // Financial Goals (Step 3)
  goals: [{
    name: { type: String },
    amount: { type: Number },
    inflationAdjusted: { type: Number }
  }],

  // Financial Plan (Step 4)
  plan: {
    monthlyInvestment: { type: Number },
    portfolioAllocation: [{
      name: { type: String },
      amount: { type: Number }
    }],
    expectedReturns: { type: String },
    riskLevel: { type: String }
  },

  // Investment Details (Step 5)
  investment: {
    paymentMethod: { type: String },
    monthlyAmount: { type: Number },
    portfolioAllocation: [{
      name: { type: String },
      amount: { type: Number }
    }]
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);