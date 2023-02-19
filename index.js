// 1. Требуется 'apollo-server'
const { ApolloServer } = require('apollo-server')

const typeDefs = `
  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
  }

  type Photo{
    id: ID!
    url: String
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
  }

  type Query{ 
    totalPhotos: Int!
    allPhotos: [Photo!]! 
  }
   
  type Mutation{
    postPhoto(input: PostPhotoInput!):Photo!
  }
`;

var _id = 0;
var users = [
  {"githubLogin": "mHattrup", "name": 'Mike Hattrup'},
  {"githubLogin": "gPlake", "name": 'Glen Plake'},
  {"githubLogin": "sSchmidt", "name": 'Scot Schmidt'}
]
var photos = [
  {
    "id": "1",
    "name": "Dropping the Heart Chute",
    "category": "ACTION",
    "githubUser": "gPlake"
  },
  {
    "id": "2",
    "name": "Enjoying the sunshine",
    "category": "SELFIE",
    "githubUser": "sSchmidt"
  }, 
  {
    "id": "3",
    "name": "Gunbarrle 25",
    "description": "25 laps on gunbarell today",
    "githubUser": "mHattrup",
    "category": "LANDSCAPE"
  }
]

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
  },

  Mutation: {
    postPhoto(parent, args) {
      var newPhoto = {
        id: _id++,
        ...args.input
      };
      photos.push(newPhoto);
      
      return newPhoto;
    }
  },

  Photo: {
    url: parent => `http://localhost:4000/img/${parent.id}.jpg`,
    postedBy: parent => {
      return users.find(u => u.githubLogin == parent.githubUser)
    }
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser == parent.githubUser)
    }
  }
};

// 2. Создаем новый экземпляр сервера
// 3. Отправляем ему объект с typeDefs и resolvers
const server = new ApolloServer({
    typeDefs,
    resolvers
})

// 4. Вызываем отслеживание на сервере для запуска веб-сервера.
server
  .listen()
  .then(({ url }) => {
    console.log(`GraphQL Service running on ${url}`)
  })