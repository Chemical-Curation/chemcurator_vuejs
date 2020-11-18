import {HTTP} from "@/store/http-common";

async function fetchCompound(id) {
  return HTTP.get(`definedCompounds/${id}`).then(res => { return res.data })
}

async function fetchByMolfile(molfile) {
  return await HTTP.get(
    `/definedCompounds?filter[molfileV3000]=${encodeURI(
      molfile
    )}`
  )
    .then(async response => {
      let obj = response.data.data.shift();

      if (obj) {
        return await fetchCompound(obj.id);
      }
    })
}

export default {
  fetchCompound, fetchByMolfile
}
