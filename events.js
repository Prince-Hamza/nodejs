

class Events {
    constructor () {
        this.url = process.env.MONGODB_CONNECTION
        this.client = new MongoClient(this.url)
    }
}


 

  


