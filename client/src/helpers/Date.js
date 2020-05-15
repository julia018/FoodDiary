/*
*  Formatted this way as my database reads it this way, please do not use this outside of this project.
*/

/*
    @name setTodaysDate,
    @type Function : String,
    @format  date = `${year}${month}${day}`;
    @description : Returns todays date in a formatted string that will be used to query DB.
  */
export const setTodaysDate = () => {
  let month = new Date().getMonth();
  let year = new Date().getFullYear();
  let day = new Date().getDate();

  if (month < 9) month = "0" + (month + 1).toString();
  if (day < 10) day = "0" + (day).toString();

  return `${year}${month}${day}`;
};

 /*
   @name previousDate,
   @type Function : String,
   @format  date = `${year}${month}${day}`;
   @description : Returns todays date in a formatted string that will be used to query DB.
 */
 export const previousDate = (date = "20200413") => {
   let year = parseInt((`${date[0]}${date[1]}${date[2]}${date[3]}`));
   let month = parseInt((`${date[4]}${date[5]}`));
   let day = parseInt((`${date[6]}${date[7]}`));

   if(day === 1 && month === 1) { year-=1;  month = 12;  day= 31; }
   else if(day === 1 && month === 2) {  month = 1;  day = 31; }
   else if(day === 1 && month === 3 && !Number.isInteger(year / 4)) {  month = 2;  day = 28;}
   else if(day === 1 && month === 3 && Number.isInteger(year / 4)) {  month = 2;  day = 29;}
   else if(day === 1 && month === 4) {  month = 3;  day = 31;}
   else if(day === 1 && month === 5) {  month = 4;  day = 30;}
   else if(day === 1 && month === 6) {  month = 5;  day = 31;}
   else if(day === 1 && month === 7) {  month = 6;  day = 30;}
   else if(day === 1 && month === 8) {  month = 7;  day = 31;}
   else if(day === 1 && month === 9) {  month = 8;  day = 31;}
   else if(day === 1 && month === 10) {  month = 9;  day = 30;}
   else if(day === 1 && month === 11) {  month = 10;  day = 31;}
   else if(day === 1 && month === 12) {  month = 11;  day = 30;}
   else { day-=1; }

   if (month < 9) month = "0" + (month).toString();
   if (day < 10) day = "0" + (day).toString();

   return `${year.toString()}${month.toString()}${day.toString()}`;
 };

   /*
    @name nextDate,
    @type Function : String,
    @format  date = `${year}${month}${day}`;
    @description : Returns todays date in a formatted string that will be used to query DB.
  */
  export const nextDate = (date = "20200414") => {
   let year = parseInt(`${date[0]}${date[1]}${date[2]}${date[3]}`);
   let month = parseInt(`${date[4]}${date[5]}`);
   let day = parseInt(`${date[6]}${date[7]}`);

   if(month === 1 && day === 31) {  month+=1;  day = 1; }
   else if(month === 2 && day === 29 && Number.isInteger(year / 4)) { month+=1;  day = 1;}
   else if(month === 2 && day === 28 && !Number.isInteger(year / 4)) { month+=1;  day = 1; }
   else if(month === 3 && day === 31) { month+=1; day = 1;}
   else if(month === 4 && day === 30) {  month+=1;  day = 1;  }
   else if(month === 5 && day === 31) {  month+=1;  day = 1; }
   else if(month === 6 && day === 30) { month+=1;  day = 1; }
   else if(month === 7 && day === 31) {  month+=1; day = 1; }
   else if(month === 8 && day === 31) {   month+=1;  day = 1; }
   else if(month === 9 && day === 30) {  month+=1;  day = 1; }
   else if(month === 10 && day === 31) {   month+=1;  day = 1; }
   else if(month === 11 && day === 30) {  month+=1;  day = 1; }
   else if(month === 12 && day === 31) {  month = 1 ; year+=1;  day = 1;}
   else { day += 1; }

   if (month < 9) month = "0" + (month).toString();
   if (day < 10) day = "0" + (day).toString();

   return `${year.toString()}${month.toString()}${day.toString()}`;
 };
