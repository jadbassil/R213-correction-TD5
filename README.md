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
7. Pour formater la date, utilisez la classe `Date` en JavaScript. Par exemple :
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
# TD 4

- Créez un nouveau fichier `js/utils.mjs`. Ce fichier est un module comme `backend.mjs` mais il contiendra des fonctions qu'on peut utiliser dans toutes les pages mais qui ne servent pas à interagir avec la base de données. Par exemple, il peut contenir la fonction suivante qui permet de formater une date:
```js
export function formatDate (date) {
    // Formater la date en français
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const DateString = new Date(date).toLocaleDateString('fr-FR', options);
    return DateString;
}
```
- Utilisez la fonction pour formater la date provenant de la base de données. On peut le faire dans la fonction `getEvents()`.

Ensuite, nous allons créer des pages dynamiques paramétrées pour afficher les détails de chaque événement en utilisant des paramètres dans les URL. Cela permet de générer des pages uniques pour chaque événement sans avoir à créer manuellement chaque page.

- Créez le dossier `agenda` dans `src/pages`.
  
- Déplacez le fichier `agenda.astro` dans le dossier `src/pages/agenda` et renommez-le `index.astro`.
  
- Vérifiez que la route `/agenda` fonctionne toujours.
  
- Dans `src/pages/agenda`, ajoutez le fichier `[id].astro`. Ce fichier est utilisé pour créer des pages dynamiques dans le projet Astro. Le `[id]` représente un paramètre dynamique qui permet de générer des pages basées sur des identifiants spécifiques.

- Dans le composant `Card`, ajoutez un lien vers cette page dynamique:
    ```html
    <a href=`agenda/${event.id}`> Plus d'info </a>
    ```

- Vous pouvez récupérer la valeur de l'id dans la page dynamique `[id].astro` en utilisant `Astro.params`:
    ```js
    const { id } = Astro.params;
    ```

- Ajoutez dans `backend.js` une fonction qui permet de récupérer les données d'un seul événement en prenant en paramètre son id. La fonction doit retourner `null` si l'id n'existe pas dans la base de données.

- Utilisez cette fonction dans `[id].astro` pour récupérer les données de l'événement ayant comme id la valeur passée en paramètre.

- Affichez les détails de l'événement dans le fichier `[id].astro`. Le composant `Card` doit afficher uniquement le titre et l'image.

- Ajoutez une page `404.astro` dans `src/pages`.

- Dans le frontmatter de `[id].astro` ajoutez la redirection vers la route `/agenda` si l'id n'existe pas dans la base de données:
    ```js
    if (!event) {
        console.error(`Event with id ${id} not found`);
        return Astro.redirect("/agenda");
    }
    ```

- Ajoutez un champ boolean `favori` dans la collection d'événements dans PocketBase.

Dans la suite, nous allons faire persister le changement de la valeur de favori depuis alpine.js.

- Si ce n'est pas encore fait, modifiez le composant Card pour changer la couleur du fond en fonction de la valeur de favori. Par exemple:
    ```html
    <div x-data=`{favori: ${event.favori}}` class="mt-10 border" :class="{'bg-yellow-100': favori}">
        <h2>{event.title}</h2>
        <img src={event.img} alt={event.imgAlt} class="w-64 h-64 object-cover" />
        <p>{event.date}</p>
        <p>{event.excerpt}</p>
        <button @click="favori =! favori" class="bg-slate-200 rounded-2xl p-3">Favori</button>
        <a href=`/agenda/${event.id}` class="bg-slate-200 rounded-2xl p-3">En savoir plus</a>
    </div>
    ```

- Ajoutez une fonction dans `backend.mjs` qui permet de modifier la valeur de favori dans la base de données:
    ```js
    export async function setFavoriteEvent(id, valeurFavori) {
        try {
            console.log("id", id, "valeurFavori", valeurFavori);
            await pb.collection("events").update(id, { favori: valeurFavori });
            return true;
        } catch (error) {
            console.log("error", error);
            return false;
        }
    }
    ```

- Dans `x-data` ajoutez la fonction `setFavori` qui change la valeur de favori et qui appelle la fonction `setFavoriteEvent`.
    ```js
    x-data=`{favori: ${event.favori}, setFavori(){ this.favori = !this.favori; setFavoriteEvent('${event.id}', this.favori);}}`
    ```

- Remplacez `@click="favori =! favori"` par `@click="setFavori()"`.

- Pour que la fonction provenant d'un module soit accessible dans le DOM pour qu'elle soit utilisable avec alpine.js, ajoutez à la fin du fichier:
    ```js
    <script>
        //@ts-nocheck
        import { setFavoriteEvent } from "../js/backend.mjs";
        window.setFavoriteEvent = setFavoriteEvent;
    </script>
    ```

> La fonction `setFavoriteEvent` sera appelée depuis le navigateur et non pas comme d'habitude sur le serveur durant le rendu de la page. Cela permettra d'interagir avec la base de données une fois qu'une interaction côté client est faite.