import { HTTP } from "@/store/http-common";

export default {
  list: async function(resource, request_details) {
    let params_string = "?";

    if (request_details && request_details.params) {
      let param;
      for (param of request_details.params) {
        params_string += `${param.key}=${param.value}&`;
      }
    }

    return await HTTP.get("/" + resource + params_string).then(res => {
      return res.data;
    });
  },
  patch: async (resource, { id, body }) => {
    return HTTP.patch(`/${resource}/${id}`, { data: { ...body } });
  },
  post: async (resource, body) => {
    return HTTP.post(`/${resource}`, { data: { ...body } });
  },
};
