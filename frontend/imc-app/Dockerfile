# Build Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Serveur Nginx
FROM nginx:alpine
COPY --from=build /app/dist/imc-app/ /usr/share/nginx/html
# Copier le fichier personnalisé de configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf      
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
