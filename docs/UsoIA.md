Este archivo no contiene texto generado por IA.

En este proyecto se usó exclusivamente Gemini.
El uso de IA en este proyecto fue fundamental para hacer barridos completos a lo largo de archivos largos y conexiones entre ellos a lo largo del repositorio.
En momentos habían conceptos que no entendía o que añadía al proyecto solo porque las lectures lo mencionaban, lo cual obviamente generaba problemas y errores. La IA fue fundamental para arreglar estos errores tanto como para enseñarme estos conceptos de manera práctica, que para mi es mucho más fácil de entender.
Sin su ayuda, me hubiera rendido por la cantidad inmensa de información.

## Prompts

Siempre se le dejaron dos cosas claras a la IA: su tarea, el contexto y lo que no debe hacer, en caso de que fuera necesario. Sin embargo, como casi todo se hizo en una misma conversación, cuando estabamos resolviendo un problema ella ya tenía bastante contexto y yo solo iba enviandole pedazos de código o logs de error de la consola. Cuando eso era resuelto, avanzabamos al siguiente problema.

En el siguiente ejemplo podemos ver como le envié pedazos del código de server.js y server.test.js lo cual fue suficiente contexto para que resolviera mi problema:

![prompt-respuesta](./media/srvrjs404.png)
<small>se puede ver como copiar y pegar código fue suficiente.</small>

---

### Debugging

Muchas veces, ya que los mismos logs de error en la consola proveen el contexto, como por ejemplo, en qué archivo hay un error, o en vitest, que dice exactamente el archivo con la línea donde ocurrió el error, y si se sabe inglés, el error se explica solo. Sin embargo, usar la IA es mucho más rápido y eficiente una vez se aprende a leer lo que envía la consola:

![prompt-respuesta](./media/npmtest.png)

### 