const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const PORT = 5500;
const app = express();

app.use(compression());
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
        result[file.name] = null;
      }
    });

    return result;
  };

  try {
    const pageStructure = getFolderStructure(pagesDir);
    res.json(pageStructure);
  } catch (err) {
    res.status(500).send('Error reading directory');
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});