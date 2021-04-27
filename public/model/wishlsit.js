export class Wishlist {
   
   
    constructor(data){

		this.name = data.name.toLowerCase()
		this.price = typeof data.price == 'number' ? data.price: Number(data.price)
		this.summary = data.summary
		this.imageName = data.imageName
		this.imageURL = data.imageURL
    this.uid = data.uid
    this.docId = data.docId
	}




	serialize(){

		return {
			name: this.name,
			price: this.price,
			summary: this.summary,
			imageName: this.imageName,
			imageURL: this.imageURL,
      uid: this.uid,
      docId: this.docId  
    }


	}

	serializeForUpdate() {
        const p = {}
        if (this.name) p.name = this.name
        if (this.price) p.price = this.price
        if (this.summary) p.summary = this.summary
        if(this.imageName) p.imageName = this.imageName 
        if (this.imageURL) p.imageURL = this.imageURL
        if (this.uid) p.uid = this.uid
        if(this.docId) p.docId = this.docId
        return p
    }

    static deserialize(data) {
      const sc = new Wishlist(data);
        sc.name = data.name
        sc.price = data.price
        sc.summary = data.summary
        sc.imageName = data.imageName
        sc.imageURL = data.imageURL
        sc.uid = data.uid
        sc.docId = data.docId
      return sc;
    }
  }
  