import { Item } from "./item";

export class Section {
    title?: string;
    suddenDeathItems?: Item[];
    mandatoryItems?: Item[];
    juniorItems?: Item[];
    regularItems?: Item[];
    seniorItems?: Item[];
    juniorScore?: number;
    regularScore?: number;
    seniorScore?: number;
    juniorScoreCell?: string;
    regularScoreCell?: string;
    seniorScoreCell?: string;
}
