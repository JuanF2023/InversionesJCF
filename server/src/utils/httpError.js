export class HttpError extends Error {
    constructor(status = 500, message = "Error") {
      super(message);
      this.status = status;
    }
  }
  
