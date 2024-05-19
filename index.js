import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { events, locations, users, participants } from './data.js'
import { nanoid } from 'nanoid';

const typeDefs = `#graphql
  type Event {
    id:ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id:ID!
    user_id:ID!
    user: User!
    participants: [Participant!]!
    location: Location!
  }

  input AddEventInput{
    title: String!
    desc: String!
    date: String!
    from: String!
    to:String!
    user_id:ID!
    location_id: ID!
  }

  input UpdateEventInput{
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id:ID
    user_id:ID
  }



  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: String!
    lng: String!
  }

  input AddLocationInput{
    name: String!
    desc:String!
    lat: String!
    lng:String!
  }

  input UpdateLocationInput{
    name: String
    desc: String
    lat: String
    lng: String
  }


  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
  }

  input AddUserInput {
    username: String!
    email: String!
  }

  input UpdateUserInput{
    username:String
    email:String
  }



  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
    user: User!
    username: String!
  }

  input AddParticipantInput{
    user_id:ID!
    event_id:ID!
  }

  input UpdateParticipantInput{
    user_id: ID
    event_id: ID
  }

  type DeleteAllOutput{
    count: Int!
  }


  type Query {
    events: [Event!]!
    event(id:ID!): Event!

    locations: [Location!]!
    location(id:ID!): Location!

    users: [User!]!
    user(id:ID!): User!

    participants: [Participant!]!
    participant(id:ID!): Participant!
  }

  type Mutation{
    addUser(data:AddUserInput!):User!
    updateUser(id:ID!, data:UpdateUserInput!):User!
    deleteUser(id:ID!):User!
    deleteAllUsers:DeleteAllOutput!

    addEvent(data:AddEventInput!): Event!
    updateEvent(id:ID!, data:UpdateEventInput!): Event!
    deleteEvent(id:ID!):Event!
    deleteAllEvents: DeleteAllOutput!

    addLocation(data:AddLocationInput!): Location!
    updateLocation(id:ID!, data:UpdateLocationInput!): Location!
    deleteLocation(id:ID!):Location!
    deleteAllLocations:DeleteAllOutput!

    
    addParticipant(data:AddParticipantInput!): Participant!
    updateParticipant(id:ID!, data: UpdateParticipantInput!):Participant!
    deleteParticipant(id:ID!):Participant!
    deleteAllParticipants:DeleteAllOutput!
  }
`;

const resolvers = {
  Mutation: {
    addEvent: (parent, { data }) => {
      const event = {
        id: nanoid(),
        ...data,
      }
      events.push(event);
      return event;
    },
    updateEvent: (parent, { id, data }) => {
      const event_index = events.findIndex((event) => event.id.toString() === id);
      if (event_index === -1) {
        throw new Error('Event not found.')
      }
      const updated_event = events[event_index] = {
        ...events[event_index],
        ...data,
      }
      return updated_event;
    },
    deleteEvent: (parent, { id }) => {
      const event_index = events.findIndex((event) => event.id.toString() === id);
      if (event_index === -1) {
        throw new Error('Event not found.')
      }
      const deleted_event = events[event_index];
      events.splice(event_index, 1)
      return deleted_event;
    },
    deleteAllEvents: () => {
      const length = events.length;
      events.splice(0, length);
      return {
        count: length,
      }
    },

    addLocation: (parent, { data }) => {
      const location = {
        id: nanoid(),
        ...data,
      }
      locations.push(location);
      return location;
    },
    updateLocation: (parent, { id, data }) => {
      const location_index = locations.findIndex((location) => location.id.toString() === id);
      if (location_index === -1) {
        throw new Error('Location not fount')
      }
      const updated_location = locations[location_index] = {
        ...locations[location_index],
        ...data,
      }
      return updated_location;
    },
    deleteLocation: (parent, { id }) => {
      const location_index = locations.findIndex((location) => location.id.toString() === id);
      if (location_index === -1) {
        throw new Error('Location not found.')
      }
      const deleted_location = locations[location_index];
      locations.splice(location_index, 1);
      return deleted_location;
    },
    deleteAllLocations: () => {
      const length = locations.length;
      locations.splice(0, length);
      return {
        count: length,
      }
    },

    addUser: (parent, { data }) => {
      const user = {
        id: nanoid(),
        ...data,
      };
      users.push(user)
      return user;
    },
    updateUser: (parent, { id, data }) => {
      const user_index = users.findIndex((user) => user.id.toString() === id);
      if (user_index === -1) {
        throw new Error('User not found.')
      }
      const updated_user = users[user_index] = {
        ...users[user_index],
        ...data,
      }
      return updated_user;
    },
    deleteUser: (parent, { id }) => {
      const user_index = users.findIndex((user) => user.id.toString() === id);
      if (user_index === -1) {
        throw new Error('User not found.')
      }
      const deleted_user = users[user_index];
      users.splice(user_index, 1);
      return deleted_user;
    },
    deleteAllUsers: () => {
      const length = users.length;
      users.splice(0, length);
      return {
        count: length,
      };
    },

    addParticipant: (parent, { data }) => {
      const participant = {
        id: nanoid(),
        ...data
      }
      participants.push(participant);
      return participant;
    },
    updateParticipant: (parent, { id, data }) => {
      const participant_index = participants.findIndex((participant) => participant.id.toString() === id);
      if (participant_index === -1) {
        throw new Error('Participant not found.')
      }
      const updated_participant = participants[participant_index] = {
        ...participants[participant_index],
        ...data,
      }
      return updated_participant;
    },
    deleteParticipant: (parent, { id }) => {
      const participant_index = participants.findIndex((participant) => participant.id.toString() === id);
      if (participant_index === -1) {
        throw new Error('Participant not found.')
      }
      const deleted_participant = participants[participant_index];
      participants.splice(participant_index, 1);
      return deleted_participant;
    },
    deleteAllParticipants: () => {
      const length = participants.length;
      participants.splice(0, length);
      return {
        count: length,
      }
    }
  },
  Query: {
    events: () => events,
    event: (parent, args) => events.find((event) => event.id.toString() === args.id),

    locations: () => locations,
    location: (parent, args) => locations.find((location) => location.id.toString() === args.id),

    users: () => users,
    user: (parent, args) => users.find((user) => user.id.toString() === args.id),

    participants: () => participants,
    participant: (parent, args) => participants.find((participant) => participant.id.toString() === args.id),
  },

  Event: {
    user: (parent, args) => users.find((user) => user.id.toString() === parent.user_id),
    location: (parent, args) => locations.find((location) => location.id.toString() === parent.location_id),
    participants: (parent, args) => participants.filter((participant) => participant.event_id.toString() === parent.id)
  },

  User: {
    events: (parent, args) => events.filter((event) => event.user_id.toString() === parent.id)
  },

  Participant: {
    user: (parent, args) => users.find((user) => user.id.toString() === parent.user_id),
    username: (parent, args) => {
      const user = users.find((user) => user.id.toString() === parent.user_id);
      return user ? user.username : null;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);