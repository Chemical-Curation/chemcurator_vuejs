import { HTTP } from "@/store/http-common";

class API {
  constructor(resourceURI) {
    this.resourceURI = resourceURI;
  }

  list(request_details) {
    let params_string = "?";

    if (request_details && request_details.params) {
      let param;
      for (param of request_details.params) {
        params_string += `${param.key}=${param.value}&`;
      }
    }

    return HTTP.get("/" + this.resourceURI + params_string);
  }

  patch({ id, body }) {
    return HTTP.patch(`/${this.resourceURI}/${id}`, { data: { ...body } });
  }

  post(body) {
    return HTTP.post(`/${this.resourceURI}`, { data: { ...body } });
  }

  delete(id) {
    return HTTP.delete(`/${this.resourceURI}/${id}`);
  }
}

export default API;
