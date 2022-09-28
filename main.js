
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/DB";
var fs = require('fs')
var dir_name=__dirname.toString()
var list_csv=[]
var artist_list=[]
function get_artworks(list, data) {
  var arts = [], i = 0;
  var sample = []
  var index = artist_list.findIndex(ind=> ind.aID == data )
  list.forEach(line=>{
    if(line.aID === data){
        sample.push(line)
        
    }
    i++
  })
  console.log(eval(sample))
  arts=sample
  return arts;
}
function csv_con(data) {
    const delimiter = ","
    const headers = data.slice(0, data.indexOf("\n")).trim('\r').split(delimiter)
    const rows = data.slice(data.indexOf("\n") + 1).trim('\r').split("\n")
    const arr = rows.map(function (row) {
    const values = row.trim('\r').split(delimiter)
    const el = headers.reduce(function (object, header, index) {
        object[header] = values[index]
        return object
      }, {})
      
      return el
    })
  
    return arr
  }
  
var list_file=fs.readdirSync(dir_name)
    list_file.forEach(file => {
        var res = file.endsWith('.csv')  
        if(res){
            list_csv.push(file)
        }
    })
list_file=[]
list_csv.forEach(file=>{
   const data1 = fs.readFileSync(__dirname.concat("/",file), "utf-8")
   list_file.push(csv_con(data1))
})
var i=1

list_file.forEach(data=>{
    i=1
    data.forEach(line=>{
      if(line.aID&& line.name){
        var index = list_file[4].findIndex(ind=> ind.stateAb == line.stateAb && line.stateAb)
        var artwork = {}
        if(index != -1){
            artwork = get_artworks(list_file[1],line.aID,artist_list)
            
            artist_list.push({aID:line.aID,aName:line.name,aBday:line.birthDate,aState:list_file[4][index].stateName,"artwork":artwork})
            
        }
      }
      i++
    })
})
console.log(artist_list)


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("DB");
  dbo.createCollection("Artists1", function(err, res) {
    if (err) throw err;
    db.close();
  });
}); 
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("EXAMPLE_1");
  dbo.collection("Artists1").insertMany(artist_list, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
}); 

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("EXAMPLE_1");
  dbo.collection("Artists1").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
}); 