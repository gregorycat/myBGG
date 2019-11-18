import fs from 'fs';

/**
 * Load a JSON File
 */
const loadJsonFile = (file) => {
    try {
        fs.accessSync(file);
        const content = fs.readFileSync(file, 'utf8');
        return JSON.parse(content);
    } catch(err) {
        console.log(`Cannot find file : ${file}`);
    }
}

export { loadJsonFile }
