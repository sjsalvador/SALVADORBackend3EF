# Usa una imagen base de Node.js
FROM node:18

# Crea el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código del proyecto
COPY . .

# Expone el puerto que usa la aplicación
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "start"]
