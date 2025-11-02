# Algoritmos Moleculares

Bienvenido al proyecto **Algoritmos Moleculares**, desarrollado por nuestro grupo con el mismo nombre. Este proyecto está basado en **Next.js** y utiliza **MongoDB** como base de datos.

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js (versión recomendada 18 o superior)  
- npm  
- MongoDB (local o remoto)  

---

## Configuración

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
````

2. Instalar las dependencias del proyecto:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias. Por ejemplo:

```
MONGODB_URI=<tu_uri_de_mongodb>
NODE_ENV="development"
```

---

## Inicialización de la base de datos

El proyecto incluye un script de seed para poblar la base de datos con datos de ejemplo. Ejecuta el siguiente comando:

```bash
npx ts-node ./src/scripts/seed.ts
```

Esto insertará los datos iniciales en tu base de datos MongoDB.

---

## Ejecución del proyecto

Para iniciar el proyecto en modo desarrollo:

```bash
npm run dev
```

El proyecto se ejecutará normalmente en `http://localhost:3000` a menos que se indique otra configuración en las variables de entorno.

---

## Scripts disponibles

* `npm run dev` - Inicia el proyecto en modo desarrollo.
* `npm run build` - Construye el proyecto para producción.
* `npm start` - Ejecuta el proyecto en producción después de construirlo.

---

## Notas adicionales

* Asegúrate de configurar correctamente las variables de entorno antes de ejecutar cualquier comando que interactúe con la base de datos.
* El proyecto está desarrollado con Next.js, por lo que cualquier cambio en la estructura de páginas o API requiere reiniciar el servidor de desarrollo para reflejarse correctamente.

---
