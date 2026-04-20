tag version="patch":
    npm version {{version}}
    npm run build:production
    npm pack

publish version="patch": (tag version)
    npm publish