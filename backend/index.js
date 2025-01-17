import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { PdfReader } from 'pdfreader';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Use the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage });

// Function to read PDF and return extracted data
function readPDF(filePath) {
  return new Promise((resolve, reject) => {
    const pdfReader = new PdfReader();
    const pdfText = [];

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        reject(`File not found: ${filePath}`);
        return;
      }

      console.log(`Reading file: ${filePath}`);

      // Parse PDF file
      pdfReader.parseFileItems(filePath, (err, item) => {
        if (err) {
          reject(`Error reading PDF: ${err.message}`);
          return;
        }

        if (!item) {
          console.log('PDF parsing completed.');
          // Resolve with the raw text instead of structured JSON
          resolve(pdfText.join(' ')); // Join the text into a single string
          return;
        }

        if (item.text) {
          pdfText.push(item.text);
        }
      });
    });
  });
}

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Call the readPDF function with the uploaded file path
    const filePath = req.file.path; // Path to the uploaded file
    const extractedText = await readPDF(filePath); // Read the PDF file and get extracted text

    // Log the extracted text to verify
    //console.log('Extracted Text:', extractedText);

    res.json({
      message: `File uploaded successfully: ${req.file.filename}`,
      data: extractedText, // Send the raw extracted text
      chatbot: {
        text: extractedText || '', // Ensure chatbot.text is defined
      },
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.json({
      message: 'Error processing file.',
      chatbot: {
        text: '', // Ensure chatbot.text is defined even on error
      },
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
