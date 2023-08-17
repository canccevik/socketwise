export enum ParamType {
  MESSAGE,
  CONNECTED_SOCKET
}

export interface ParamMetadata {
  target: Object
  value: Function
  index: number
  paramType: ParamType
}
