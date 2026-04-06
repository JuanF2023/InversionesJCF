// client/src/services/api/fields.api.js
import http from "@/core/http/HttpClient.js";
import { qs } from "./api.js";

export async function listSuggestedFields({ typeId, kind }) {
  return http.get(
    `/business-types/${typeId}/suggested-fields${qs({ kind })}`
  );
}

export async function searchFieldLibrary({ q }) {
  return http.get(`/fields${qs({ q })}`);
}



