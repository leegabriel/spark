Accounts.onCreateUser(function (options, user) {
  var attributes = {
  	profile: options.profile,
  	avatar: options.avatar,
    points: options.points,
  	followers: options.followers,
    ipAddress: options.ipAddress
  };
  
  user = _.extend(user, attributes);
  user.avatar = 'http://orig12.deviantart.net/3c64/f/2015/204/f/2/default_round_by_gabejlee-d92i0si.png';
  user.points = 0;
  user.followers = [];
  
   
  var email = user.emails[0].address;
  if (!email) {
    alert('Error.');
  }

  return user;
});

