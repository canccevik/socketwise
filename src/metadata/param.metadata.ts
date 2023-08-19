export enum ParamType {
  MESSAGE,
  SOCKET_IO,
  CONNECTED_SOCKET,
  SOCKET_ID,
  SOCKET_REQUEST,
  SOCKET_ROOMS,
  MESSAGE_ACK,
  SOCKET_QUERY_PARAM,
  NAMESPACE_PARAMS,
  NAMESPACE_PARAM
}

export interface ParamMetadata {
  target: Object
  value: Function
  index: number
  paramType: ParamType
  options?: Record<string, unknown>
}
