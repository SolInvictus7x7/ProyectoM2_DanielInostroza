# 🚀 API Blog - Proyecto M2 Daniel Inostroza

API RESTful profesional para la gestión de autores y publicaciones de un blog. Este proyecto demuestra habilidades en integración de bases de datos relacionales, manejo de errores centralizado, pruebas automatizadas y documentación bajo el estándar OpenAPI.

## 🛠️ Tecnologías y Stack
* **Backend:** Node.js v22+ con Express.js.
* **Base de Datos:** PostgreSQL (Relacional).
* **Testing:** Vitest & Supertest para cobertura integral.
* **Documentación:** Swagger UI con especificación YAML.
* **Deployment:** Railway en https://proyectom2danielinostroza-production.up.railway.app

---

## ⚙️ Configuración y Ejecución Local

### 1. Requisitos Previos
* Tener instalado **Node.js** y **npm**.
* Tener una instancia de **PostgreSQL** activa.

### 2. Instalación
```bash
git clone https://github.com/SolInvictus7x7/ProyectoM2_DanielInostroza
cd ProyectoM2_DanielInostroza
npm install
```

### 3. Base de Datos
Ejecuta el contenido del archivo setup.sql en tu terminal de PostgreSQL o cliente favorito (como pgAdmin o DBeaver) para crear las tablas e insertar los datos iniciales:

```Bash
psql -U tu_usuario -d tu_base_de_datos -f setup.sql
```

### 4. Variables de Entorno (.env)
Crea un archivo .env en la raíz con tus credenciales locales:

```text
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_de_tu_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password
PORT=3000
NODE_ENV=development
```

### 5. Ejecución
```Bash
npm run dev
```

---

## 🧪 Testing y Cobertura
Se han implementado tests unitarios y de integración para validar la lógica de negocio y la estabilidad del servidor.

-Ejecutar tests: npm test
    se pueden ejecutar los tres archivos .test.js independientemente al añadir la ruta (/tests/["Nombre del archivo"])
-Interfaz visual de tests: npm run test:ui
-Reporte de cobertura: npm run test:coverage

---

## 📖 Documentación OpenAPI (Swagger)
La API cuenta con documentación interactiva generada con Swagger UI.

Acceso local: Una vez iniciado el servidor, visita http://localhost:3000/api-docs para probar los endpoints de Autores y Posts en tiempo real.

---

## ☁️ Deployment en Railway
Configuración del Entorno
1. Base de Datos: Se utilizó el servicio de Postgres de Railway.
2. Variables de Entorno:
    -NODE_ENV: production
    -DATABASE_URL: ${{Postgres.DATABASE_URL}} (Utiliza la URL interna para máxima velocidad).
    Nota: Para conexiones locales externas, se utiliza la DATABASE_PUBLIC_URL y el puerto específico asignado por el proxy de Railway.

Pasos de Deploy
1. Conectar el repositorio de GitHub a Railway.
2. Configurar el comando de inicio como npm start.
3. Asegurar que el archivo .env no se suba al repositorio (gestionado por variables en el panel de Railway).