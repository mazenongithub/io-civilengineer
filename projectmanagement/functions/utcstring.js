module.exports = (dateobj) => {
    
    const zeroPadding = (num) => {
                if (num < 10) {
                    num = `0${num}`

                }
                return num

            }
            const getOffsetTime = (timein) => {
                let datein = new Date(`${timein.replace(/-/g, '/')} UTC`)
                let offset = datein.getTimezoneOffset() / 60;

                return offset;

            }

            let month = dateobj.getMonth() + 1;
            month = zeroPadding(month)
            let day = dateobj.getDate();
            day = zeroPadding(day)
            let year = dateobj.getFullYear();
            let hours = dateobj.getHours();
            let minutes = dateobj.getMinutes();
            let seconds = dateobj.getSeconds();
            seconds = zeroPadding(seconds)
            minutes = zeroPadding(minutes)
            hours = zeroPadding(hours);
            let timein = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
            let offset = getOffsetTime(timein) * 2;
            let sym = '+';
            if (offset > 0) {
                sym = '-';
            }
            if (Math.abs(offset) < 10) {
                offset = `0${offset}`
            }

            const newDate = new Date(`${timein}${sym}${offset}:00`)
            hours = newDate.getHours();
            hours = zeroPadding(hours)
            year = newDate.getFullYear();
            day = newDate.getDate();
            day = zeroPadding(day);
            month = newDate.getMonth() + 1;
            month = zeroPadding(month);
            minutes = newDate.getMinutes();
            minutes = zeroPadding(minutes);
            seconds = newDate.getSeconds(seconds);
            seconds = zeroPadding(seconds);

            timein = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
            return timein

    
}