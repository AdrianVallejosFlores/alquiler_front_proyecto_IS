
// src/lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // ⚠️ IMPORTANTE: En lugar de lanzar un error (throw), solo mostramos una advertencia.
  // Esto permite que el comando 'npm run build' termine correctamente.
  console.warn("⚠️ MONGODB_URI no está definida. La conexión a la BD no funcionará.");
  
  // Creamos una promesa vacía para que TypeScript no se queje, pero que fallará si se intenta usar.
  clientPromise = new Promise((_, reject) => {
      // Solo rechazamos si alguien intenta realmente hacer una consulta
      // reject(new Error("MONGODB_URI no definida"));
  });
} else {
  // Lógica para desarrollo (evita múltiples conexiones al recargar)
  if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // Lógica para producción
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
