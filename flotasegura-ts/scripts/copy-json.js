const fs = require("fs");
const path = require("path");

const carpetaOrigen = path.join(__dirname, "..", "src", "data");
const carpetaDestino = path.join(__dirname, "..", "dist", "data");

if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino, { recursive: true });
}

const archivos = fs.readdirSync(carpetaOrigen).filter((archivo) => archivo.endsWith(".json"));

archivos.forEach((archivo) => {
  fs.copyFileSync(path.join(carpetaOrigen, archivo), path.join(carpetaDestino, archivo));
});

console.log(`se copiaron ${archivos.length} archivo(s) json a dist/data`);
