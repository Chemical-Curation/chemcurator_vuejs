// actions
import { HTTP } from "@/store/http-common";

export default {
  async getList(context, resource) {
    // let resource = context.state.resource
    await HTTP.get("/" + resource).then(response => {
      console.log(response);
      context.commit("storeList", response.data.data);
      context.commit("storeCount", response.data.meta.pagination.count);
    });
  }
};
