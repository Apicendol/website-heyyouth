const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('Preview', function(filePath) {
    if (filePath.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Fix Javascript -> javascript case
        content = content.replace(/Javascript\//g, 'javascript/');

        // Fix duplicate Script.js inclusion (if any at the end of body vs top)
        // Usually migrate-firebase.js injected at the bottom before </body>, 
        // but maybe it was already there. Let's find occurrences of <script src="javascript/Script.js"></script>
        
        const scriptTag = '<script src="javascript/Script.js"></script>';
        const parts = content.split(scriptTag);
        
        if (parts.length > 2) {
            // More than 1 occurrence
            console.log(`Found ${parts.length - 1} occurrences of Script.js in ${filePath}. Removing duplicates.`);
            
            // Keep only the first occurrence
            content = parts[0] + scriptTag + parts.slice(1).join('');
        }

        fs.writeFileSync(filePath, content);
    }
});
console.log("HTML files updated!");
