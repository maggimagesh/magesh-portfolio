# ---- Build Stage ----
    FROM node:20-alpine AS build
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    RUN npm run build
    
    # ---- Production Stage ----
    FROM nginx:alpine
    
    # Remove default nginx html
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy nginx config
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy build output
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Expose port
    EXPOSE 80
    
    # Start nginx
    CMD ["nginx", "-g", "daemon off;"]
    