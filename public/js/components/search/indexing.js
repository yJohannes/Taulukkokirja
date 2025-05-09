import { formatPathLabel } from "../explorer/index.js";

export function extractStructurePaths(obj, basePath = '') {
    const paths = [];
    
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = basePath ? `${basePath}/${key}` : key;
        
        if (value === null) {
            // It's a file
            paths.push(currentPath);
        } else if (typeof value === 'object') {
            // It's a folder
            paths.push(...extractStructurePaths(value, currentPath));
        }
    }
    
    return paths;
}

export async function indexPages(miniSearchRef) {
    const response = await fetch('/api/pages-structure');
    const json = await response.json();
    const paths = extractStructurePaths(json);

    for (let path of paths) {
        try {
            const response = await fetch(path);
            const html = await response.text();
            
            // Strip HTML to plain text
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const content = tempDiv.textContent || tempDiv.innerText || '';
            
            // Add to index
            miniSearchRef.add({ id: path, title: formatPathLabel(path, false), content: content });
        } catch (err) {
            console.error(`Failed to fetch ${path}`, err);
        }
    }
}