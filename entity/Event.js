export default class Event {
    constructor(id, image, title, dateTime, location, isAvailable, category){
        this.id = id;
        this.image = image;
        this.title = title;
        this.dateTime = dateTime;
        this.location = location;
        this.isAvailable = isAvailable;
        this.category = category;
    }
}