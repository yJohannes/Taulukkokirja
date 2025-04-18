const express = require('express');
const compression = require('compression');

// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const path = require('path');
const fs = require('fs');


// const RATE_LIMIT = rateLimit({
  //   windowMs: 15 * 60 * 1000,  // 15 minutes
  //   max: 1000,                 // limit per IP
  // });
  
  // app.use(RATE_LIMIT);
  // app.use(
    //   helmet.contentSecurityPolicy({
      //     directives: {
        //       defaultSrc: ["'self'"],
        //       scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        //     },
        //   })
        // );
const PORT = 5500;
const app = express();

app.use(compression());

// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/pages-structure', (req, res) => {
  const pagesDir = path.join(__dirname, 'public', 'pages');

  // Helper function to recursively get all files in directories
  const getFolderStructure = (dir) => {
    const result = {};

    const filesAndDirs = fs.readdirSync(dir, { withFileTypes: true });

    filesAndDirs.forEach(file => {
      const fullPath = path.join(dir, file.name);

      // If it's a directory, recursively get its structure
      if (file.isDirectory()) {
        result[file.name] = getFolderStructure(fullPath);
      } else {
        // If it's a file, add to the current folder's list
        result[file.name] = null; // Or you can store file metadata here
      }
    });

    return result;
  };

  try {
    const pageStructure = getFolderStructure(pagesDir);
    res.json(pageStructure); // Send the folder structure as JSON
  } catch (err) {
    res.status(500).send('Error reading directory');
  }
});

// Start the server and listen for incoming requests
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});