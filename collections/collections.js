Ideas = new Mongo.Collection('ideas');
Projects = new Mongo.Collection('projects');
Comments = new Mongo.Collection('comments');
Tags = new Mongo.Collection('tags');

Ideas.initEasySearch(['title', 'slug', 'blurb', 'details', 'tags', 'count', 'ownerName', 'createdAt'], {
    // 'limit' : 20,
    'use' : 'mongo-db'
});

Projects.initEasySearch(['title', 'slug', 'blurb', 'details', 'tags', 'location', 'rewards', 'count', 'ownerName', 'createdAt', 'funded', 'pledged', 'backers'], {
    // 'limit' : 20,
    'use' : 'mongo-db'
});