# TD 1

**Objectif**: Au cours des TDs, nous allons développer un site web pour un conservatoire tout en pratiquant Astro.

1. Commencez par l'installation : [Guide d'installation Astro](https://docs.astro.build/fr/install-and-setup/)

2. Installez Tailwind avec la commande : 
    ```sh
    npx astro add tailwind
    ```

3. Installez l'adaptateur Netlify pour que le site puisse être déployé sur Netlify avec la commande (https://docs.astro.build/fr/guides/integrations-guide/netlify/):
    ```sh
    npx astro add netlify
    ```

4. Supprimez tous les fichiers `.astro` sauf `index.astro`.

5. Créez un nouveau layout contenant un composant header et footer, ainsi qu'un contenu entre les deux.

6. Passez le titre de la page en tant que props au layout.

7. Créez un menu dans le header et un message dans le footer.

# TD 2

**Objectif**: L'objectif de ce TD est d'afficher une liste de données, dans notre site ce sera la liste des événements dans l'agenda du conservatoire :

1. Créez la page `pages/agenda.astro`.

2. Ajoutez la page dans le menu de navigation dans `components/Header.astro`.

3. Ajoutez la liste des événements suivante dans le frontmatter de `agenda.astro` :
```js
const events = [
    {
        title: "Conférence sur les astres",
        date: "Lundi 12 Juillet",
        favori: true,
    },
    {
        title: "Atelier sur les étoiles",
        date: "Mardi 13 Juillet",
        favori: false,
    },
];
```

4. Affichez la liste des événements en utilisant la fonction `events.map` dans des composants Card.

5. Ajoutez l'intégration `alpine.js` avec la commande :
```
npx astro add alpine.js
```

6. En utilisant alpine.js, changez la couleur du fond de la carte en fonction de si l'événement est favori.

# TD 3

**Objectifs**:
- Afficher une liste de données dynamiques provenant d'une base de données.
- Formater une date en JavaScript.
- Utiliser des modules JavaScript.

1. Installez le paquet `pocketbase` pour pouvoir se connecter à la base de données et utiliser l'API PocketBase en exécutant la commande : `npm install pocketbase`.
2. Créez le fichier `backend.mjs` dans le dossier `src/js`. Ce fichier est un module JavaScript qui gère les communications avec PocketBase.
3. Comme vu dans le module R214, créez une instance de `PocketBase` :
    ```js
    import PocketBase from "pocketbase";
    const pb = new PocketBase("http://127.0.0.1:8090");
    ```

    > La constante `pb` contient une instance de la classe `PocketBase`. Elle peut maintenant être utilisée pour interagir avec le serveur PocketBase et effectuer des opérations CRUD (Create, Read, Update, Delete).

4. Écrivez la fonction vue dans le module R214 pour récupérer la liste des événements dans `backend.mjs`:
```js
export async function getEvents() {
    const today = new Date().toISOString();
    let events = await pb.collection("events").getFullList(
        {
            sort: "-date",
            order: "desc",
            filter: `date >= "${today}"`,
        }
    );
    return events;
}
```
5. Afin de récupérer les images, PocketBase utilise un système de stockage de fichiers. Vous pouvez accéder aux images en utilisant l'URL sauvegardée dans la collection avec la fonction `pb.files.getURL(record, url)`.
6. Pour chaque élément dans la liste récupérée d'événements, ajoutez une propriété contenant l'URL de l'image :
```js
events.forEach((event) => {
    event.img = pb.files.getURL(event, event.imgUrl);
});
```
1. Pour formatter la date, utilisez la classe `Date` en JavaScript. Par exemple :
```js
const eventDate = new Date(event.date);
const formattedDate = eventDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});
event.formattedDate = formattedDate;
```

