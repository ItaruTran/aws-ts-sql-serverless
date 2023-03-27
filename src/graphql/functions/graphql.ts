/* eslint-disable import/no-unresolved */
import { Handler } from 'aws-lambda';

const resolvers = {
  Mutation: {},
  Query: {},
}

export const main: Handler = async (event) => {
  const typeHandler = resolvers[event.typeName];
  if (typeHandler) {
    const resolver = typeHandler[event.fieldName];
    if (resolver) {
      // eslint-disable-next-line no-return-await
      try {
        return await resolver(event);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
  throw new Error('Resolver not found.');
};
