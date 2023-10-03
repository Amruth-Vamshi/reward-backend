import bigDecimal from "js-big-decimal";
import { ROUNDING } from "../constants/constant";

/*
 * @param {points}
 * return points after rounding off based on precision and rounding mode
 */
export async function roundOff(points) {
    try {
        let decimalNumber = new bigDecimal(points.toString());
        let result = decimalNumber.round(
            ROUNDING.PRECISION,
            bigDecimal.RoundingModes[ROUNDING.MODE]
        );
        return parseFloat(result.getValue());
    } catch (ex) {
        return points;
    }
}
