import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/bfhl", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.json());

const FULL_NAME = "Anubhava Tripathi";
const DOB = "21052004";
const EMAIL = "anubhava2105@gmail.com";
const ROLL_NUMBER = "22BCE0520";

const formatUserId = () => `${FULL_NAME.toLowerCase()}_${DOB}`;

const processData = (data) => {
  let odd = [];
  let even = [];
  let alphabets = [];
  let specials = [];
  let sum = 0;

  data.forEach((item) => {
    if (!isNaN(item)) {
      const num = parseInt(item, 10);
      sum += num;
      if (num % 2 === 0) {
        even.push(item);
      } else {
        odd.push(item);
      }
    } else if (/^[a-zA-Z]+$/.test(item)) {
      alphabets.push(item.toUpperCase());
    } else {
      specials.push(item);
    }
  });

  // concat string: reverse order of alphabets with alternating caps
  let concatString = alphabets
    .join("")
    .split("")
    .reverse()
    .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");

  return {
    is_success: true,
    user_id: formatUserId(),
    email: EMAIL,
    roll_number: ROLL_NUMBER,
    odd_numbers: odd.toString(),
    even_numbers: even.toString(),
    alphabets: alphabets.toString(),
    special_characters: specials.toString(),
    sum: sum.toString(),
    concat_string: concatString,
  };
};
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running. Use POST /bfhl to test the API.",
  });
});
app.get("/bfhl/get", (req, res) => {
  res.json({
    operation_code: 1,
  });
});

app.post("/bfhl", (req, res) => {
  try {
    if (!req.body.data || !Array.isArray(req.body.data)) {
      return res
        .status(400)
        .json({ is_success: false, message: "Invalid input" });
    }
    const result = processData(req.body.data);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ is_success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
