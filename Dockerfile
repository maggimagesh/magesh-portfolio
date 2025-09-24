# ---- Build Stage ----
    FROM node:20-alpine AS build
    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy all project files
    COPY . .
    
    # Build the Vite app
    RUN npm run build
    
    # ---- Production Stage ----
    FROM nginx:alpine
    
    # Clear default nginx html folder
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy custom nginx configuration
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy build output from build stage (includes resume.json automatically)
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Expose port 80
    EXPOSE 80
    
    # Start nginx
    CMD ["nginx", "-g", "daemon off;"]
    