
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('list', { 
    title: 'List', 
    items: [1991, 'byvoid', 'express', 'Node.js'] 
  });
};

