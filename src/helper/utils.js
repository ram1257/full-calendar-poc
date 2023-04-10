export function timeConversion(data) {
  const date = new Date(data).toString().split(" "); 
  return date[2] + "-" + date[1] + "-" + date[3]
}
