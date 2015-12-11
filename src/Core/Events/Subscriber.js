function Subscriber(){

   this.handle = function(event){
     // Get event name
     var eventName = event.constructor.name;

     var method = 'when' + eventName;

     if(typeof this[method] === 'function'){
       try{
         this[method](event);
       }
       catch(e){
         console.log("Subscriber Error: " + e.message);
       }
     }
   }
}

module.exports = Subscriber;
