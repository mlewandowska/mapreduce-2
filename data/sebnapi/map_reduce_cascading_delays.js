map = function () {
    if(this.ARR_DELAY > 0){
        var x = {"flight_id": this._id , "delay": this.ARR_DELAY};
        var t = this.ARR_TIME.split(":");
        var part_of_day = Math.round((parseInt(t[0])*60+parseInt(t[1]))/60);
        emit(this.DEST+"-"+part_of_day, {"incomming" : x, "outgoing" : null});
    }
    if(this.DEP_DELAY > 0){
        var y = {"flight_id": this._id , "delay": this.DEP_DELAY};
        var t = this.DEP_TIME.split(":");
        var part_of_day = Math.round((parseInt(t[0])*60+parseInt(t[1]))/60);
        emit(this.ORIGIN+"-"+part_of_day, {"incomming" : null, "outgoing" : y});
    }
}

reduce = function (key, values) {
    incomming = [];
    outgoing = [];
    for ( var i=1; i<values.length; i++ ) {
        if(values[i].incomming != null){
            incomming.push(values[i].incomming);
        }
        if(values[i].outgoing != null){
            outgoing.push(values[i].outgoing);
        }
    }
    
    if (incomming.length > 0 && outgoing.length > 0){
        return {"incomming":incomming,  "outgoing" : outgoing};
    }
}

db = db.getSiblingDB('rita')
var result = db.flights.mapReduce(map, reduce, { out : { inline : true }});
printjson(result);


