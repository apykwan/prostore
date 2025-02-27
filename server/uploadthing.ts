import { UTApi } from "uploadthing/server";

let utapi: UTApi | null = null;

export function getUTApi() {
  if (!utapi) utapi = new UTApi();
  return utapi;
}