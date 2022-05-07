import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export default (strArr) => {
    dayjs.extend(customParseFormat);
    return strArr.map((item) => {
        let start = item.indexOf("[") + 1;
        let end = item.indexOf("]");
        let start2 = item.indexOf(".") + 1;
        let str = item.slice(start2, end);
        let str2;
        if (str.length == 2) {
            str2 = item.slice(start, end - 2).concat("0" + str);
        } else
            str2 = item.slice(start, end);
        let minute = dayjs(str2, "mm:ss:SSS").get('minute');
        let secend = dayjs(str2, "mm:ss:SSS").get('second');
        let millisecond = dayjs(str2, "mm:ss:SSS").get('millisecond') / 1000;
        return minute * 60 + secend + millisecond;
    });
}