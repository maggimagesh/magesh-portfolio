# ---- Build Stage ----
    FROM node:20-alpine AS build
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    RUN npm run build
    
    # ---- Production Stage ----
    FROM nginx:alpine
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy nginx config
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy build output (includes resume.json now)
    COPY --from=build /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    