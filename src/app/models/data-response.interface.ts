import { StationState } from './station-state.interface';

export interface DataResponse {
  type: string;
  data: StationState[];
}
