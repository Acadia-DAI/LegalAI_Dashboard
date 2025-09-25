#!/bin/sh

# Log info
echo "Injecting environment variables into envconfig.js..."

# Create config.js file with injected env variables
echo "window._env_ = {" > /usr/share/nginx/html/envConfig.js

# Inject REACT_APP_API_BASE_URL if set
if [ -n "$REACT_APP_API_BASE_URL" ]; then
  echo "  REACT_APP_API_BASE_URL: '$REACT_APP_API_BASE_URL'," >> /usr/share/nginx/html/envConfig.js
fi

if [ -n "$REACT_APP_UI_BASE_URL" ]; then
  echo "  REACT_APP_UI_BASE_URL: '$REACT_APP_UI_BASE_URL'," >> /usr/share/nginx/html/envConfig.js
fi

echo "};" >> /usr/share/nginx/html/envConfig.js

echo " config.js generated:"
cat /usr/share/nginx/html/envConfig.js
echo " Starting Nginx..."

exec "$@"
