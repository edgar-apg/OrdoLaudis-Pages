# Ordo Laudis ✥

**Ordo Laudis** es un visor sencillo para consultar la Liturgia de las Horas y el Misal diario desde una interfaz limpia, responsiva y orientada a la oración.

El proyecto busca ayudar a la consulta cotidiana de los textos litúrgicos, especialmente para quienes desean rezar con más orden, recogimiento y continuidad.

## Finalidad del proyecto 🙏

Ordo Laudis no pretende sustituir los libros litúrgicos oficiales ni las aplicaciones oficiales existentes. Su finalidad es pastoral y práctica: ofrecer una forma accesible de consultar los textos litúrgicos del día y acompañar la oración personal o comunitaria.

La página incluye una guía dinámica para orientar el uso del Invitatorio, el Oficio de lectura y Laudes, especialmente cuando se rezan como primera oración del día o en secuencia.

## Fuente de los textos litúrgicos 📖

Los textos litúrgicos se consultan desde el sistema público de la **Conferencia del Episcopado Mexicano (CEM)**.

Ordo Laudis es un visor no oficial. No pertenece a la CEM, no representa oficialmente a la CEM y no modifica la fuente litúrgica original. Cualquier error, interrupción, cambio de disponibilidad o variación en los textos consultados depende de la fuente externa correspondiente.

## Guía litúrgica y Santoral Dominicano 🤍🖤

Ordo Laudis integra la **Guía litúrgica** y el **Santoral Dominicano** en un mismo panel dinámico. La mitad izquierda orienta algunas secuencias de oración de la Liturgia de las Horas; la mitad derecha ayuda a consultar si la fecha seleccionada tiene una memoria dominicana verificada en la selección actual.

La Guía litúrgica permite seguir algunas secuencias frecuentes, como:

- Invitatorio → Laudes
- Invitatorio → Oficio de lectura
- Invitatorio → Oficio de lectura → Laudes

También incluye una guía básica para el Misal, incluyendo una opción de consulta cuando la celebración se relaciona con Vísperas. En el modo Misal, Ordo Laudis ofrece además un acceso directo al comentario del Evangelio del día publicado por Dominicos.org, calculando el enlace conforme a la fecha seleccionada.

El Santoral Dominicano se ofrece como una ayuda de consulta vinculada al carisma de la Orden de Predicadores. En esta versión, Ordo Laudis usa una selección manual de memorias dominicanas con fecha, descripción, enlace y señal de si la ficha contiene Liturgia de las Horas u otra ayuda de oración.

Cuando una fecha tiene memoria dominicana registrada, el panel puede mostrar el santo, beato o celebración correspondiente y ofrecer un enlace al propio o al santoral fuente. Esto no modifica automáticamente los textos litúrgicos del CEM ni reemplaza el discernimiento litúrgico correspondiente.

Para usar un propio dominicano, conviene revisar la celebración del día, el grado litúrgico, el calendario local y las indicaciones propias de la comunidad o de quien preside. Ordo Laudis sólo facilita el acceso a la información; no pretende ser un calendario litúrgico oficial de la Orden ni una edición oficial de sus textos propios.

Las fechas y enlaces del Santoral Dominicano se mantienen como una selección manual verificable y pueden requerir ajustes conforme se revisen las fichas fuente.

## Música ambiental 🎧

La música ambiental integrada es opcional y está pensada sólo como acompañamiento para la oración personal.

Las pistas musicales pertenecen a **Universfield** y fueron obtenidas desde **Pixabay**, conforme a las condiciones de uso indicadas por dicha plataforma. Ordo Laudis no reclama autoría sobre esas obras ni las ofrece como descarga independiente.

## Inspiración dominicana 🤍🖤

Ordo Laudis está inspirado espiritualmente en el carisma dominicano, especialmente en la tradición de oración, estudio, comunidad y predicación vivida también por las **Fraternidades Laicales Dominicanas**.

La intención del proyecto es servir a la vida de oración y ayudar a que la liturgia pueda ser rezada con mayor conciencia, belleza y sencillez.

## Aviso ⚠️

Este proyecto es de uso pastoral, devocional y educativo. No es una edición litúrgica oficial, no sustituye los libros aprobados para la celebración litúrgica y no debe entenderse como una publicación oficial de ninguna institución eclesial.

El uso de fuentes externas, textos litúrgicos, santoral, oraciones y música se realiza con intención de facilitar la consulta y acompañar la oración, respetando la autoría y titularidad de sus respectivos responsables.

---

*Laudare, Benedicere, Praedicare — in Rete.* 🏁


## Mejoras de uso diario agregadas

Esta versión agrega mejoras sobre la versión subida:

- Indicador de hora sugerida de la Liturgia de las Horas.
- Estado visible de carga del iframe, con opción de reintentar o abrir en CEM si tarda demasiado.
- Botón flotante dinámico para controlar la música.
- Si una guía está activa, el botón flotante muestra controles de siguiente, anterior y salir.
- Animaciones suaves en botones y transiciones ligeras del visor.
- Favicon con la cruz de Ordo Laudis.

Versión de archivos: `ordo-mejoras-actual-1`.


## Ajuste del botón flotante

Esta versión retira de la interfaz el botón no flotante de música. La sección de música queda oculta visualmente, pero se conserva en el DOM para que los controles existentes sigan funcionando desde JavaScript.

El botón flotante ahora usa un ícono compuesto `♪ ✥`, para sugerir música y rezo guiado. Cuando hay música activa muestra pausa, y cuando hay guía activa resalta la cruz.

Versión de archivos: `ordo-fab-musica-guia-2`.


## Ajuste visual de hora sugerida y FAB

- La hora sugerida ahora aparece compacta debajo de la fila “Guía litúrgica / Santoral Dominicano”.
- La tarjeta ocupa aproximadamente la mitad de alto que la versión anterior.
- El botón flotante ahora prioriza el ícono de rezo guiado `✥` y deja la música `♪` como segundo elemento visual.

Versión de archivos: `ordo-fab-ajustes-ui-3`.


## Ajuste del FAB como selector de guía

- Se elimina la barra visible de “Hora sugerida”.
- La indicación de hora sugerida permanece sólo como marca discreta en los botones de las Horas.
- El botón flotante ahora permite escoger directamente una guía de rezo:
  - Laudes como primer rezo.
  - Oficio de lectura primero.
  - Oficio + Laudes.
  - Misa habitual.
  - Misa con Vísperas.
- Después de escoger una guía desde el FAB, el mismo botón muestra los controles de Siguiente, Anterior y Salir.

Versión de archivos: `ordo-fab-guia-boton-4`.


## Ajuste del estado de carga del iframe

Esta versión cambia el aviso de carga para que no tape el texto del CEM durante las pruebas en Live Server.

- El aviso de carga inicial se oculta solo después de unos segundos.
- Si la carga tarda, el aviso se convierte en una tarjeta pequeña no bloqueante.
- El iframe queda visible aunque el evento de carga externo tarde en responder.
- Se conservan las opciones de Reintentar y Abrir en CEM.

Versión de archivos: `ordo-iframe-no-bloqueante-5`.


## Controles superiores compactos y aviso de carga

- Los botones “Liturgia de las Horas” y “Misal” quedan más bajos y discretos.
- La sección de fecha se redujo en encabezado, márgenes, campo de fecha y botón “Hoy”.
- El aviso de carga ya no aparece al abrir cada texto.
- El aviso sólo aparece después de varios segundos si el iframe no reporta carga.

Versión de archivos: `ordo-controles-compactos-6`.


## Hora sugerida automática

Esta versión conserva la marca visual de la hora sugerida en los botones, pero además selecciona automáticamente esa Hora al entrar a la página.

También se aplica al presionar “Hoy” o al cambiar la fecha de nuevo al día actual.

Versión de archivos: `ordo-hora-sugerida-auto-7`.


## FAB con acción directa

Esta versión transforma el botón flotante según el estado:

- Si hay guía activa, el botón se convierte en flecha `➜` y avanza directamente al siguiente paso.
- Si hay música sonando y no hay guía activa, el botón se convierte en pausa `❚❚`.
- Si hay guía y música al mismo tiempo, se prioriza el siguiente paso del rezo.
- Si no hay guía activa ni música reproduciéndose, el botón abre el menú normal de guía y música.

Versión de archivos: `ordo-fab-accion-directa-8`.


## FAB con botones auxiliares contextuales

Esta versión cambia el flujo del botón flotante:

- El botón principal ya no se transforma; siempre abre el menú de guía y música.
- Si hay una guía activa, aparece un botón auxiliar `➜` para avanzar al siguiente paso.
- Si la música está sonando, aparece un botón auxiliar `❚❚` para pausar.
- Si guía y música están activas al mismo tiempo, aparecen ambos botones auxiliares.
- Al seleccionar una opción dentro del menú del FAB, el menú se cierra automáticamente.

Versión de archivos: `ordo-fab-botones-auxiliares-9`.


## Guías compactas

Esta versión reduce el tamaño de las tarjetas de guía de rezo para que queden en proporción con los controles superiores compactos.

- Tarjetas más bajas.
- Menos padding interno.
- Tipografía ligeramente más pequeña.
- Separación más discreta.
- Aplica tanto a la guía de Liturgia de las Horas como a la guía del Misal.

Versión de archivos: `ordo-guia-compacta-10`.


## Iframe sin interferencia

Esta versión corrige la interacción con los controles internos del CEM dentro del iframe.

- El aviso de carga ya no se coloca como capa sobre el visor.
- El iframe queda siempre interactivo.
- El aviso sólo aparece como tarjeta flotante pequeña si el iframe no reporta carga después de 20 segundos.
- Se evita que el estado de carga bloquee botones internos como aumentar o disminuir texto.

Versión de archivos: `ordo-iframe-sin-interferencia-11`.


## Iframe limpio sin overlay

Esta versión elimina por completo el estado visual de carga sobre el iframe del CEM.

- No se crea ninguna capa encima del iframe.
- El iframe queda siempre libre para los botones internos del CEM.
- Se agrega `tabindex="0"` al iframe para mejorar el foco.
- Se incluye un `sw.js` desactivador para limpiar Service Workers y cachés antiguos de pruebas anteriores.
- `app.js` también intenta borrar registros y cachés antiguos de Ordo Laudis al cargar.

Versión de archivos: `ordo-iframe-limpio-12`.


## Enfoque preventivo del iframe CEM

Esta versión intenta corregir el comportamiento en el que los botones internos del CEM necesitan un clic previo dentro del iframe.

- El iframe queda con `loading="eager"`.
- Al cargar el iframe, se enfoca varias veces de forma suave.
- También se intenta enfocar `contentWindow` del iframe.
- Se repite el enfoque al entrar el cursor, tocar el iframe, volver a la ventana o regresar a la pestaña.
- No se agrega ninguna capa visual encima del visor.

Versión de archivos: `ordo-iframe-focus-cem-13`.


## FAB sin interferencia con el iframe

Esta versión ajusta el botón flotante para que su contenedor fijo no capture clics fuera de los botones reales.

- El contenedor `.ordo-fab` queda con `pointer-events: none`.
- Sólo el botón principal, los botones auxiliares y el menú reciben clics.
- Cuando el menú está cerrado, el menú no puede interceptar clics invisibles.
- Se evita que un clic sobre el área del visor CEM sea usado por el listener global para cerrar el FAB.
- Se mantiene la lógica de enfoque preventivo del iframe.

Versión de archivos: `ordo-fab-no-interfiere-14`.
