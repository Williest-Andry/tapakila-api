export default class Reservation {
    constructor(id, idUser, idTicket, evenTitle, eventDateTime, eventLocation, ticketType, quantity, reservationDateTime){
        this.id = id;
        this.idUser = idUser;
        this.idTicket = idTicket;
        this.evenTitle = evenTitle;
        this.eventDateTime = eventDateTime;
        this.eventLocation = eventLocation;
        this.ticketType = ticketType;
        this.quantity = quantity;
        this.reservationDateTime = reservationDateTime;
    }
}