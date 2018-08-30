# um-resource-scraper
A web scraper for obtaining the resources of your profile in the University of Murcia.

# English

The english docs are not available yet. You can contribute and make a PR to help!

# Spanish

## Introducción

Con `um-resource-scraper` puedes descargarte todos los recursos de todas tus asignaturas del **Aula virtual** con tan solo un par de clicks. Cualquier aportación al proyecto es bien recibida.

Para hacer esto posible el programa utiliza un _navegador headless_ basado en google chrome, con el que se hace login en el portal de entrada de la universidad y con el que se va recorriendo las distintas páginas de recursos de cada asignatura.

Ya que el software se basa en un _web scraper_ para obtener los recursos, podrá dejar de funcionar siempre que se actualice cualquier página de la Universidad de Murcia.

## Aviso importante

El autor de este software no se hace responsable de cualquier uso ilegal o poco ético que se pueda hacer de él. El programa está diseñado únicamente con fines educativos. Al usarlo, el usuario es el único responsable de las posibles consecuencias. El software está publicado bajo la licencia MIT y no se ofrece ninguna garantía de su funcionamiento.

## ¿Por qué tengo que introducir mi contraseña?

Los recusos de cada asignatura del aula virtual están protegidos, y tan solo los alumnos matricuados pueden acceder a ellos. Por eso, sin hacer un login previo, es imposible poder descargar dichos recursos. Tu contraseña no será almacenada en ningún sitio, y los recursos que descargues solo serán almacenados en tu ordenador.

## Instalación

Para descargar e instalar las dependencias del programa, necesitas tener instalado `git`, `node` y `npm` en tu sistema:

```
git clone https://github.com/dizzyrobin/um-resource-scraper
cd um-resource-scraper
npm install
```

## Ejecución

Para ejecutar el programa en modo desarrollo:

```
npm run dev
```

## ¿Qué pasa si no tengo instalado eso de "node", o "git"?

Ahora mismo, tanto `node` como `git` son requisitos indispensables para la instalación y ejecución del programa. En alguna versión más adelante se distribuirán binarios para los principales sistemas operativos.
