const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Health Insurance Risk Calculator API is running');
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

//Risk API (Coltin Rogge)
app.post('/risk', (req, res) => {
  const { age, bmiCategory, bpCategory, familyHistory} = req.body;

  // getting the input validation
  if (age === null || bmiCategory === null || bpCategory === null || familyHistory === null) {
    return res.status(400).json({error: 'All fields are required.'});
  }
  let riskScore = 0;

  // age risk scoring
  if (age < 30) { riskScore += 0; }
  else if (age < 45) { riskScore += 10; }
  else if (age < 60) { riskScore += 20; }
  else  riskScore += 30; 

  // BMI risk scoring
  if (bmiCategory === "normal") { riskScore += 0; }
  else if (bmiCategory === "overweight") { riskScore += 30; }
  else if (bmiCategory === "obese") { riskScore += 75; }

  // Blood Pressure risk scoring
  if (bpCategory === "normal") { riskScore += 0; }
  else if (bpCategory === "elevated") { riskScore += 15; }
  else if (bpCategory === "stage_1") { riskScore += 30; }
  else if (bpCategory === "stage_2") { riskScore += 75; }
  else if (bpCategory === "crisis") { riskScore += 100; }

  // family history risk scoring
  if (familyHistory.includes("diabetes")) { riskScore += 10; }
  if (familyHistory.includes("cancer")) { riskScore += 10; }
  if (familyHistory.includes("Alzheimer")) { riskScore += 10; }

  // final risk level 
  let riskLevel;
  if (riskScore <= 20) { riskLevel = "Low risk"; }
  else if (riskScore <= 50) { riskLevel = "Moderate risk"; }
  else if (riskScore <= 75) { riskLevel = "High risk"; }
  else { riskLevel = "Uninsurable"; }

  console.log("Risk Score calculated:", req.body);
  console.log("Response sent:", { riskScore, riskLevel });

  res.json({ riskScore, riskLevel });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});