import { MDDate } from "./MDDate";
import { MDForecastDay } from "./MDForecastDay";
import { MDModel } from "./MDModel";
import { MDRegion } from "./MDRegion";

export interface MetadataDimensions {
  region: MDRegion;
  model: MDModel;
  forecast_day: MDForecastDay;
  date: MDDate;
}
