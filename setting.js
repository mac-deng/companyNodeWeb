module.exports = { 
  cookieSecret: 'microblogbyvoid', 
  db: 'bands', 
  host: process.env.VCAP_SERVICES || "mongodb://hjqdengwei:7624112@linus.mongohq.com:10032/macd_hjq_dw"
}; 
/*process.env.MONGOHQ_URL="mongodb://hjqdengwei:7624112@linus.mongohq.com:10032/macd_hjq_dw";
process.env.VCAP_SERVICES//macdeng.tk db host
module.exports = { 
  cookieSecret: 'microblogbyvoid', 
  db: 'microblog', 
  host: process.env.MONGOHQ_URL
}; */