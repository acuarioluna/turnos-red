import { readFile } from "node:fs";

export function ejemploLecturaConCallback(): void {
  readFile("./data/turnos.json", "utf-8", (error, contenido) => {
    if (error) {
      console.error("Error al leer el archivo mediante callback:", error);
      return;
    }

    console.log("Archivo leído mediante callback.");
    console.log(`Cantidad de caracteres: ${contenido.length}`);
  });
}

/*
Comparación:

La lectura mediante callbacks funciona correctamente, pero obliga a procesar
el resultado dentro de una función anidada. Cuando se encadenan varias
operaciones, el código puede resultar más difícil de leer y mantener.

La aplicación utiliza node:fs/promises con async/await porque permite escribir
el proceso de forma más clara, controlar los errores con try...catch y evitar
la anidación excesiva de callbacks.
*/
