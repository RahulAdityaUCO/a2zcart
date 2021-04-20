export class Review {
    constructor(data) {
      this.prodId = data.prodId;
      this.content = data.content;
      this.mail = data.mail;
      this.timeStamp = data.timeStamp;
      this.imageURL = data.imageURL
      this.imageName = data.imageName
    }
  
    serialize(timeStamp) {
      return {
        prodId: this.prodId,
        content: this.content,
        mail: this.mail,
        imageURL: this.imageURL,
        timeStamp: timeStamp,
        imageName: this.imageName
      };
    }
  
    serializeForUpdate(timeStamp) {
      const r = {};
      if (this.prodId) r.prodId = this.prodId;
      if (this.content) r.content = this.content;
      if (this.mail) r.mail = this.mail;
      if (this.imageURL) r.imageURL = this.imageURL;
      r.timeStamp = timeStamp;
      if (this.imageName) r.imageName = this.imageName;
      return r;
    }
  
    static deserialize(data) {
      const sc = new Review(data);
      sc.prodId = data.prodId;
      sc.content = data.content;
      sc.mail = data.mail;
      sc.imageURL = data.imageURL;
      sc.timeStamp = data.timeStamp;
      sc.imageName = data.imageName;
      return sc;
    }
  }
  