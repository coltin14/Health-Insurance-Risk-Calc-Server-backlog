const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* PING API */
app.get('/ping', (req, res) => {
  res.json({ message: 'Server is awake!' });
});

/* BMI API */
app.post('/bmi', (req, res) => {
  const { weight, heightFeet, heightInches } = req.body;
  // input validation  
  if (!weight || !heightFeet || !heightInches) {
    return res.status(400).json({ error: 'Weight and height are required.' });
  } 
  if (typeof weight !== 'number' || typeof heightFeet !== 'number' || typeof heightInches !== 'number') {
    return res.status(400).json({ error: 'Weight and height must be numbers.' });
  }
  if (heightFeet <= 0 || heightInches < 0) {
    return res.status(400).json({ error: 'Height must be positive.' });
  }
  const height = (heightFeet * 12 + heightInches);
  // round to one decimal
  const bmi = parseFloat(weight / (height * height) * 703).toFixed(1);

  let category;

  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi < 25) {
    category = 'Healthy';
  } else if (bmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obesity';
  }
  res.json({ bmi, category });
});