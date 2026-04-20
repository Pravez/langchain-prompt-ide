tag version="patch":
    npm version {{version}}
    npm run build:production
    npm pack

publish version="patch": (tag version)
    npm publish

lint-and-fix:
    npm run format
    npm run typecheck
    npm run lint:fix
    npm run build