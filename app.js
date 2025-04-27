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

  const getFolderStructure = (dir) => {
    const result = {};
  
    const filesAndDirs = fs.readdirSync(dir, { withFileTypes: true });
  
    // Separate files and directories
    const files = filesAndDirs.filter(file => file.isFile());
    const directories = filesAndDirs.filter(file => file.isDirectory());
  
    // Process files first
    files.forEach(file => {
      result[file.name] = null;
    });
  
    // Then process directories
    directories.forEach(dirent => {
      const fullPath = path.join(dir, dirent.name);
      result[dirent.name] = getFolderStructure(fullPath);
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