tag-and-publish version="patch":
    npm version {{version}}
    npm run build:production
    npm pack