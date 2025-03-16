require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:8081', 'exp://localhost:19000'],
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://suryasriramamurthy2003:sriram1234@cluster0.vjlyu.mongodb.net/")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body); // Add logging

    const { fullName, email, mobile, age, password } = req.body;
    
    // Create new user
    const user = new User({
      fullName,
      email,
      mobile,
      age,
      password
    });

    await user.save();
    console.log('User saved successfully:', user); // Add logging

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        age: user.age
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: error.message || 'Registration failed'
    });
  }
});

// Update Client Details (Step 1)
app.put('/api/users/:userId/client-details', async (req, res) => {
  try {
    const { retirementAge, lifeExpectancy } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { retirementAge, lifeExpectancy },
      { new: true }
    );
    res.json({ message: 'Client details updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Financial Goals (Step 3)
app.put('/api/users/:userId/goals', async (req, res) => {
  try {
    const { goals } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { goals },
      { new: true }
    );
    res.json({ message: 'Goals updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Financial Plan (Step 4)
app.put('/api/users/:userId/plan', async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { plan },
      { new: true }
    );
    res.json({ message: 'Plan updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Investment Details (Step 5)
app.put('/api/users/:userId/investment', async (req, res) => {
  try {
    const { investment } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { investment },
      { new: true }
    );
    res.json({ message: 'Investment details updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Risk Assessment endpoint
app.put('/api/users/:userId/risk-assessment', async (req, res) => {
  try {
    const {
      monthlyIncome,
      annualIncomeGrowth,
      monthlyExpenses,
      annualExpenseGrowth,
      inflationRate,
      emiDetails
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        riskAssessment: {
          monthlyIncome,
          annualIncomeGrowth,
          monthlyExpenses,
          annualExpenseGrowth,
          inflationRate,
          emiDetails
        }
      },
      { new: true }
    );

    res.json({
      message: 'Risk assessment updated',
      user
    });
  } catch (error) {
    console.error('Error updating risk assessment:', error);
    res.status(500).json({
      message: error.message || 'Failed to update risk assessment'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});