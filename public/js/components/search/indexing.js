import { formatting } from "../../pages/formatting.js";
import { loadExplorerStructure } from "../explorer/index.js";

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

export async function indexPages(miniSearch) {
    const structure = await loadExplorerStructure();
    const paths = extractStructurePaths(structure);

    for (let path of paths) {
        try {
            const response = await fetch(encodeURI(path));
            const html = await response.text();
            
            // Strip HTML to plain text
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const content = tempDiv.textContent || tempDiv.innerText || '';
            
            // Add to index
            miniSearch.add({ id: path, title: formatting.formatPathToLabel(path, false), content: content });
        } catch (err) {
            console.error(`Failed to fetch ${path}`, err);
        }
    }
}