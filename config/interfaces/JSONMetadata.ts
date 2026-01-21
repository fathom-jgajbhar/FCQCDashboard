import { MetadataDimensions } from "./MetadataDimensions";
import { VarDesc } from "./VarDesc";

export interface JSONMetadata {
  dimensions: MetadataDimensions;
  variables: VarDesc[];
}
