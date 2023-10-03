import moment from "moment";

export const corsOptionsDelegate = (req, callback) => {
  // get the list of allowed endpoints
  const allowlist = process.env.ALLOWED_DOMAINS.split(" ");
  let corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

export const isValidDate = (date) => {
  return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

export const serializeDate = (res) => {
    let resObject = res;
    resObject = Object.entries(resObject)
    for(let i = 0; i<resObject.length; i++){
      let entry = resObject[i]
      const [key, value] = entry;
      if(typeof value === 'object' && value !== null){
        if(isValidDate(value)){
          res[`${key}`] = moment(value).format('YYYY-MM-DD HH:mm:ss')
        }else{
          serializeDate(value)
        }
      }
    };
}