export default class Ticket {
    constructor(id, idEvent, price, availableQuantity, type){
        this.id = id;
        this.idEvent = idEvent;
        this.price = price;
        this.availableQuantity = availableQuantity;
        this.type = type;
    }
}