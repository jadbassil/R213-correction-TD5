# TD 5
L'objectif de ce TD est de créer des formulaires pour gérer les entrées utilisateur et les communiquer avec PocketBase.
Pour plus d'informations sur les formulaires HTML, consultez : [MDN Web Docs: Your first form](https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form).

Nous allons commencer par créer une page contenant un formulaire permettant d'ajouter un événement dans la base de données.

- Créez la page `add.astro` dans le dossier `agenda`. Cette page contiendra un formulaire permettant à l'utilisateur de saisir les données d'un événement :
```js
---
import Layout from "../../layouts/Layout.astro";
---

<Layout title="Ajouter un événement">
    <h1 class="text-3xl">Ajouter un événement</h1>
    <form class="flex flex-col p-4">
        <input type="text" name="title" placeholder="Titre" class="border my-4 p-2 rounded-md" />
        <select name="categorie" class="border my-4 p-2">
            <option value="Théâtre">Théâtre</option>
            <option value="Musique">Musique</option>
        </select>
        <input type="text" name="excerpt" placeholder="Extrait" class="border my-4 p-2 rounded-md" />
        <select name="lieu" class="border my-4 p-2">
            <option value="Théâtre">Théâtre</option>
            <option value="Conservatoire">Conservatoire</option>
        </select>
        <textarea name="description" placeholder="Description" class="border my-4 p-2 rounded-md"></textarea>
        <input type="date" name="date" class="border my-4 p-2 rounded-md" />
        <input type="file" name="imgUrl" class="border my-4 p-2 rounded-md" />
        <input type="submit" value="Ajouter" class="bg-slate-500 rounded-lg p-5" />
    </form>
</Layout>
```

> Attention : l'attribut `name` dans les balises `<input/>` doit correspondre au nom du champ dans la collection de votre base de données.

- Ajoutez un lien dans la page `agenda/index.astro` menant à la nouvelle page contenant le formulaire :
```html
<a href="/agenda/add" class="text-blue-800 underline">Ajouter un événement</a>
```

- Vérifiez l'affichage.
- Ajoutez les attributs suivants dans la balise `<form>` de la page `agenda/add.astro` :
```html
<form
    class="flex flex-col p-4"
    action="/agenda/add" 
    method="post"  
    enctype="multipart/form-data"
>
<!--
action="/agenda/add" : Spécifie la route où les données du formulaire seront envoyées.
method="post" : Définit la méthode HTTP utilisée pour envoyer les données du formulaire.
enctype="multipart/form-data" : Indique que le formulaire peut envoyer des fichiers (pour les images).
-->
```

- Dans le fichier `backend.mjs`, ajoutez la fonction qui crée un nouvel enregistrement dans votre collection :
```js
/**
 * Ajoute un événement à la collection "events".
 * @param {Object} data - Les données de l'événement à ajouter.
 * @returns Un objet contenant le statut de l'opération et un message.
 */
export async function addEvent(data) {
    try {
        await pb.collection("events").create(data);
        return {
            success: true,
            message: "L'événement a été ajouté avec succès.",
        };
    } catch (error) {
        return {
            success: false,
            message: "Une erreur est survenue lors de l'ajout de l'événement : " + error,
        };
    }
}
```

- Dans le frontmatter de la page `add.astro`, traitez les données si la requête est de type `POST` et appelez la fonction `addEvent` pour créer un nouvel enregistrement :
```js
let pbMessage = ""; // Initialisation de la variable pour stocker le message de retour

if (Astro.request.method === "POST") { // Vérifie si la méthode de la requête est POST
    const data = await Astro.request.formData(); // Récupère les données du formulaire de la requête
    console.log(data); // Affiche les données du formulaire dans la console

    const eventDate = new Date(data.get("date")?.toString() || new Date()); // Convertit la date du formulaire en objet Date, ou utilise la date actuelle si non spécifiée

    if (eventDate < new Date()) { // Vérifie si la date de l'événement est dans le passé
        pbMessage = "La date doit être dans le futur"; // Définit le message d'erreur si la date est dans le passé
    } else {
        const resp = await addEvent(data); // Appelle la fonction addEvent avec les données du formulaire et attend la réponse
        pbMessage = resp.message; // Définit le message de retour avec le message de la réponse
    }
}
```

- Ajoutez l'affichage de `pbMessage` pour afficher le message de retour :
```html
<p>{pbMessage}</p>
```

- Vérifiez le fonctionnement en vous assurant qu'un nouvel enregistrement a été ajouté dans la base de données.

---
Dans la suite, nous allons utiliser un formulaire dans `agenda/index.astro` pour filtrer les événements par catégorie.

- Définissez la liste des catégories dans le frontmatter :
```js
const categories = ['Tout', 'Théâtre', 'Musique']; // Cette liste doit contenir toutes les catégories exactement comme elles sont définies dans PocketBase.
console.log(categories);
```

> Vous pouvez aussi utiliser une liste dynamique :
```js 
const categories = ['Tout', ...new Set(events.map((event) => event.categorie))]; // Retourne une liste de catégories d'événements sans doublons.
```

- Ajoutez un formulaire qui utilise la balise `<select>` pour choisir la catégorie :
```html
<form action="/agenda" method="post">
    <label for="categorie">Filtrer par catégorie :</label>
    <select name="categorie">
        {
            // Parcourir la liste de catégories et afficher chaque catégorie dans une balise <option>
            categories.map((categorie) => (
                <option value={categorie}>{categorie}</option>
            ))
        }
    </select>
    <input type="submit" value="Filtrer" />
    <br /><br />
</form>
```

- Dans le frontmatter, ajoutez la gestion du formulaire pour filtrer les événements en fonction de la catégorie sélectionnée :
```js
if (Astro.request.method == 'GET') {
    events = await getEvents(); // Retourne une liste d'événements en ejoutant un champ "img" contenant le URL complet de l'image associée à l'événement.
    console.log(categories);
} else if(Astro.request.method == 'POST') {
    const data = await Astro.request.formData();
    const categorie = data.get('categorie');
    if(categorie != 'Tout'){
        const response = await filterByCategory(categorie);
        events = response.events;
        // Mettre la categire choisie en haut de la liste
        categories = [categorie, ...categories.filter((c) => c != categorie)];
    } else {
        events = await getEvents();
    }
}
```

- Ajoutez la fonction `filterByCategory(categorie)` dans le fichier `backend.js`:
```js
export async function filterByCategory(category) {
    try {
        let events = await pb.collection("events").getFullList({
            filter: `categorie = "${category}"`,
        });
        events = events.map((event) => {
            event.img = pb.files.getURL(event, event.imgUrl);
            return event;
        });
        return {
            success: true,
            events: events,
            message: "Les événements ont été filtrés avec succès.",
        }
    } catch (error) {
        return {
            success: false,
            events: [],
            message: "Une erreur est survenue lors du filtrage des événements: " + error,
        }
    }
}
```