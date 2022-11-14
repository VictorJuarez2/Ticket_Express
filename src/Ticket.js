class Ticket {
    constructor(costIn, ticketIDIn, eventObject) {
      this.cost = costIn;
      this.ticketID = ticketIDIn;
      this.event = eventObject;
    }

    //Getters
    get cost(){
        return this.cost;
    }

    get ticketID(){
        return this.ticketID;
    }

    get event(){
        return this.event;
    }
  }
  