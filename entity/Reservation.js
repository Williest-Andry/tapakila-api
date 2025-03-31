export default class Reservation {
    constructor(id, idUser, idTicket, eventTitle, eventDateTime, eventLocation, ticketType, quantity, reservationDateTime){
        this.id = id;
        this.idUser = idUser;
        this.idTicket = idTicket;
        this.eventTitle = eventTitle;
        this.eventDateTime = eventDateTime;
        this.eventLocation = eventLocation;
        this.ticketType = ticketType;
        this.quantity = quantity;
        this.reservationDateTime = reservationDateTime;
    }
}