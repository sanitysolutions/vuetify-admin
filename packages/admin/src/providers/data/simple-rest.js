import {
  GET_LIST,
  GET_MANY,
  GET_ONE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY,
} from "./actions";

import FetchJson from "../utils/fetch";
import qs from "qs";

export default (httpClient) => {
  if (typeof httpClient === "string") {
    httpClient = new FetchJson(httpClient);
  }

  const fetchApi = async (type, resource, params = {}) => {
    switch (type) {
      case GET_LIST: {
        const { pagination, sort, filter } = params;

        let query = {
          filter: JSON.stringify(filter),
        };

        if (pagination) {
          let { page, perPage } = pagination;

          query = {
            ...query,
            range: JSON.stringify([(page - 1) * perPage, page * perPage]),
          };
        }

        if (sort && sort.length) {
          query = {
            ...query,
            sort: JSON.stringify([sort[0].by, sort[0].desc ? "DESC" : "ASC"]),
          };
        }

        let { json, headers } = await httpClient.get(
          `${resource}?${qs.stringify(query)}`
        );

        return {
          data: json,
          total: parseInt(headers.get("content-range").split("/").pop(), 10),
        };
      }

      case GET_MANY: {
        let { json } = await httpClient.get(
          `${resource}?${qs.stringify({
            filter: JSON.stringify({ id: params.ids }),
          })}`
        );

        return { data: json };
      }

      case GET_ONE: {
        let { json } = await httpClient.get(`${resource}/${params.id}`);

        return { data: json };
      }

      case CREATE: {
        let { json } = await httpClient.post(`${resource}`, params.data);
        return { data: json };
      }

      case UPDATE: {
        let { json } = await httpClient.put(`${resource}`, params.data);
        return { data: json };
      }

      case DELETE: {
        let { json } = httpClient.delete(`${resource}`);
        return { data: json };
      }

      default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
  };

  return {
    [GET_LIST]: (resource, params) => fetchApi(GET_LIST, resource, params),
    [GET_MANY]: (resource, params) => fetchApi(GET_MANY, resource, params),
    [GET_ONE]: (resource, params) => fetchApi(GET_ONE, resource, params),
    [CREATE]: (resource, params) => fetchApi(CREATE, resource, params),
    [UPDATE]: (resource, params) => fetchApi(UPDATE, resource, params),
    [UPDATE_MANY]: (resource, params) =>
      Promise.all(
        params.ids.map((id) =>
          fetchApi(UPDATE, resource, { id, data: params.data })
        )
      ).then(() => Promise.resolve()),
    [DELETE]: (resource, params) => fetchApi(DELETE, resource, params),
    [DELETE_MANY]: (resource, params) =>
      Promise.all(
        params.ids.map((id) => fetchApi(DELETE, resource, { id }))
      ).then(() => Promise.resolve()),
  };
};