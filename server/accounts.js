Accounts.onCreateUser(function (options, user) {
  var attributes = {
  	profile: options.profile,
  	avatar: options.avatar,
    points: options.points,
  	followers: options.followers,
    ipAddress: options.ipAddress
  };
  
  user = _.extend(user, attributes);
  user.avatar = 'http://orig11.deviantart.net/27aa/f/2015/198/d/4/d4a2edb99411452e907fff3ea49bb15e-d91rkxa.png';
  user.points = 0;
  user.followers = [];
  
   
  var email = user.emails[0].address;
  if (!email) {
    alert('Error.');
  }

  return user;
});