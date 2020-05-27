import * as moment from "moment";

export const formatMillisecondsToMmSs = (milliseconds: number): string =>
  moment.utc(milliseconds).format("mm:ss");
