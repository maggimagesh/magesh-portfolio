# ---- Build Stage ----
    FROM node:20-alpine AS build
    WORKDIR /app
    
    # Install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy source code
    COPY . .
    
    # Build React/Vite app
    RUN npm run build
    
    # ---- Production Stage ----
    FROM nginx:alpine
    
    # Remove default nginx html
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy nginx configuration
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy build output
    COPY --from=build /app/dist /usr/share/nginx/html
    # Ensure resume.json is present even if build cache was stale
    COPY --from=build /app/public/resume.json /usr/share/nginx/html/resume.json
    
    # Expose port 80
    EXPOSE 80
    
    # Start nginx
    CMD ["nginx", "-g", "daemon off;"]
    