export enum ParamType {
  MESSAGE,
  CONNECTED_SOCKET,
  SOCKET_ID
}

export interface ParamMetadata {
  target: Object
  value: Function
  index: number
  paramType: ParamType
}
