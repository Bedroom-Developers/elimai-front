
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const tz_5 = 'Asia/Almaty'
const dayjsTZ = dayjs

export default  dayjsTZ
