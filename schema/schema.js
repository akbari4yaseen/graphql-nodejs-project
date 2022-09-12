const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = graphql;
const _ = require("lodash");

// Dummy Data
const books = [
  { id: "1", name: "In Search of Lost Time", year: "2004", authorid: "1" },
  { id: "2", name: "Don Quixote", year: "2003", authorid: "2" },
  {
    id: "3",
    name: " One Hundred Years of Solitude",
    year: "1967",
    authorid: "3",
  },
  {
    id: "4",
    name: "Of Love and Other Demons",
    year: "1994",
    authorid: "3",
  },
  {
    id: "5",
    name: "Chronicle of a Death Foretold",
    year: "1981",
    authorid: "3",
  },
];

const authors = [
  { id: "1", firstname: "Marcel", lastname: "Proust" },
  { id: "2", firstname: "Miguel", lastname: "Cervantes" },
  { id: "3", firstname: "Gabriel Garcia", lastname: "Marquez" },
];

// Graphql object type --> Book Type
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    year: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorid });
      },
    },
  }),
});

// Graphql object type --> Author Type
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    lastname: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorid: parent.id });
      },
    },
  }),
});

// Graphql query ---> Root query
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / all the source
        return _.find(books, { id: args.id });
      },
    },

    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      },
    },

    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      },
    },

    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

module.exports = schema;
