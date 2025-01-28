import PocketBase from "pocketbase";
import { formatDate } from "./utils.mjs";

const pb = new PocketBase("http://127.0.0.1:8090");



export async function getEvents() {
    const today = new Date().toISOString(); // Récupérer la date du jour. Regardez la doc de la méthode toISOString pour plus d'informations: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Date
    let events = await pb.collection("events").getFullList(
        {
            sort: "-date",
            order: "desc",
            filter: `date >= "${today}"`,
        }
    ); // Filtrer les événements passés en fonction de la date. Si la colonne date n'est pas dans votre collection, vous pouvez la remplacer par une autre colonne de type date.
    events = events.map((event) => {
        event.img = pb.files.getURL(event, event.imgUrl);
        return event;
    }); // Récupérer l'URL de l'image de chaque événement. Vous pouvez remplacer imgUrl par le nom de la colonne qui contient le nom de l'image.
    events = events.map((event) => {
        event.date = formatDate(event.date);
        return event;
    }); // Formater la date de chaque événement. Vous pouvez remplacer date par le nom de la colonne qui contient la date de l'événement. La fonction formatDate est importée du fichier utils.mjs.
    return events;
}

