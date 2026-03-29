import fs from 'fs';
import path from 'path';

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(fullPath));
        } else {
            results.push(fullPath);
        }
    });
    return results;
}

const srcFiles = walkDir('src').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

let changedFilesCount = 0;
let modifiedImagesComponents = 0;

srcFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Add unoptimized to <Image /> components to prevent slow Next.js processing
    if (file.endsWith('.tsx')) {
        const imageTagRegex = /(<Image\b(?![^>]*\bunoptimized\b)[^>]*?)(\/?>)/g;
        content = content.replace(imageTagRegex, (match, prefix, suffix) => {
            modifiedImagesComponents++;
            return prefix + ' unoptimized ' + suffix;
        });
    }

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        changedFilesCount++;
        console.log(`Updated: ${file}`);
    }
});

console.log(`Added unoptimized to <Image> components: ${modifiedImagesComponents}`);
console.log(`Total files modified: ${changedFilesCount}`);
