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
