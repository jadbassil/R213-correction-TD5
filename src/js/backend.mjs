import PocketBase from "pocketbase";
import { formatDate } from "./utils.mjs";

const pb = new PocketBase("http://127.0.0.1:8090");

export async function getEvents() {
    const today = new Date().toISOString();
    let events = await pb.collection("events").getFullList(
        {
            sort: "-date",
            order: "desc",
            filter: `date >= "${today}"`,
        }
    );
    events.forEach((event) => {
        event.img = pb.files.getURL(event, event.imgUrl);
    });
    events.forEach((event) => {
        event.date = formatDate(event.date);
    });
    console.log(events);
    return events;
}

