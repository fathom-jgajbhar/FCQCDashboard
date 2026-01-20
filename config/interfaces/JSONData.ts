import { JSONDataDate } from "./JSONDataDate";
import { JSONMetadata } from "./JSONMetadata";
import { Region } from "./Region";

// Main interface for JSON data structure
export interface JSONData {
    metadata : JSONMetadata;
    date: JSONDataDate[];
    region: Region[];
}