import * as fs from 'fs';

const post = (original, forPublish) => {
    const content = fs.readFileSync(forPublish).toString();
    fs.unlinkSync(forPublish);
    fs.writeFileSync(original, content);
};

const pre = (original, forPublish) => {
    const originalContent = fs.readFileSync(original).toString();
    const content = originalContent
        .split('\n')
        .filter((line) => !line.includes('src/env.rs'))
        .join('\n');
    fs.writeFileSync(forPublish, originalContent);
    fs.writeFileSync(original, content);
};

const main = () => {
    const type = process.argv[2];
    const original = '.gitignore';
    const forPublish = '.gitignore-original';
    switch (type) {
        case 'pre-publish': {
            pre(original, forPublish);
            break;
        }
        case 'post-publish': {
            post(original, forPublish);
            break;
        }
    }
};

main();
