export type ZortoutAPIData = {
  storename: string;
  apikey: string;
  apisecret: string;
}

export type ZortoutAPIResponse = {
  message: string;
  data: ZortoutAPIData;
}
