export enum ParamType {
  MESSAGE,
  SOCKET_IO,
  CONNECTED_SOCKET,
  SOCKET_ID,
  SOCKET_REQUEST,
  SOCKET_ROOMS
}

export interface ParamMetadata {
  target: Object
  value: Function
  index: number
  paramType: ParamType
}
