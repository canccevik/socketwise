export enum ParamType {
  MESSAGE
}

export interface ParamMetadata {
  target: Object
  value: Function
  index: number
  paramType: ParamType
}
