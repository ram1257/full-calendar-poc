export function timeConversion(data) {
  const date = new Date(data).toString().split(" "); 
  console.log(date[2] + "/" + date[1] + "/" + date[3]);
  return date[2] + "-" + date[1] + "-" + date[3]
}
