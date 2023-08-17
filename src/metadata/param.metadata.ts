export enum ParamType {
  MESSAGE,
  SOCKET_IO,
  CONNECTED_SOCKET,
  SOCKET_ID
}

export interface ParamMetadata {
  target: Object
  value: Function
  index: number
  paramType: ParamType
}
