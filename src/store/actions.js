// actions
import { HTTP } from "@/store/http-common";

export default {
  getList: async (context, request_details) => {
    let resource = await context.dispatch("getResourceURI");
    if (!resource)
      console.error("Did you define getResourceURI action on your module?");

    context.commit("loading");
    let params_string = "?";
    if (request_details && request_details.params) {
      let param;
      for (param of request_details.params) {
        params_string += `${param.key}=${param.value}&`;
      }
    }

    await HTTP.get("/" + resource + params_string).then(response => {
      context.commit("storeList", response.data.data);
      context.commit("storeCount", response.data.meta.pagination.count);
      if (response.data.included)
        context.commit("storeIncluded", response.data.included);
    });
    await context.commit("loaded");
  },
  patch: async (context, { id, body }) => {
    let resource = await context.dispatch("getResourceURI");
    if (!resource)
      console.exception("Did you define getResourceURI action on your module?");

    return HTTP.patch(`/${resource}/${id}`, { data: { ...body } });
  },
  post: async (context, body) => {
    let resource = await context.dispatch("getResourceURI");
    if (!resource)
      console.error("Did you define getResourceURI action on your module?");

    return HTTP.post(`/${resource}`, { data: { ...body } });
  }
};
