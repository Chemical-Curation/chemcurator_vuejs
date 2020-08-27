// actions
import { HTTP } from "@/store/http-common";

export default {
  getList: async context => {
    let resource = await context.dispatch("getResourceURI");
    if (!resource)
      console.exception("Did you define getResourceURI action on your module?");

    await HTTP.get("/" + resource).then(response => {
      context.commit("storeList", response.data.data);
      context.commit("storeCount", response.data.meta.pagination.count);
    });
  }
};
