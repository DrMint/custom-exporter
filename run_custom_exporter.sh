# Prevent bun from installing dev dependencies
export NODE_ENV=production

git pull

bun ci
bun start
