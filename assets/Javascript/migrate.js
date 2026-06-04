const fs = require('fs');
const path = require('path');

const previewDir = path.join(__dirname, 'Preview');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            console.log(`Processing ${fullPath}`);
            let content = fs.readFileSync(fullPath, 'utf8');

            // Regex to remove tailwind CDN script
            content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/g, '');

            // Regex to remove tailwind.config script block
            content = content.replace(/<script>\s*tailwind\.config\s*=\s*{[\s\S]*?}\s*<\/script>\s*/g, '');

            // Add the new CSS link
            // Check if it's in CMS to adjust relative path
            const isCMS = fullPath.includes('CMS');
            const cssPath = isCMS ? '../Style/tailwind.css' : 'Style/tailwind.css';
            
            // Add tailwind.css before Style.css or before </head>
            if (!content.includes(cssPath)) {
                if (content.includes('href="Style/Style.css"')) {
                    content = content.replace('<link rel="stylesheet" href="Style/Style.css">', `<link rel="stylesheet" href="${cssPath}">\n    <link rel="stylesheet" href="Style/Style.css">`);
                } else if (content.includes('href="../Style/Style.css"')) {
                    content = content.replace('<link rel="stylesheet" href="../Style/Style.css">', `<link rel="stylesheet" href="${cssPath}">\n    <link rel="stylesheet" href="../Style/Style.css">`);
                } else {
                    content = content.replace('</head>', `    <link rel="stylesheet" href="${cssPath}">\n</head>`);
                }
            }

            fs.writeFileSync(fullPath, content);
            console.log(`Updated ${fullPath}`);
        }
    }
}

processDir(previewDir);
