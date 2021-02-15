/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $lectureId: String!
    $userId: String!
    $message: String!
    $usertype: Int!
  ) {
    createMessage(
      lectureId: $lectureId
      userId: $userId
      message: $message
      usertype: $usertype
    ) {
      lectureId
      messageId
      userId
      usertype
      userName
      message
      updatedDate
      createdDate
      deletedDate
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $lectureId: String!
    $messageId: ID!
    $message: String!
  ) {
    updateMessage(
      lectureId: $lectureId
      messageId: $messageId
      message: $message
    ) {
      lectureId
      messageId
      userId
      usertype
      message
      updatedDate
      createdDate
      deletedDate
    }
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage($lectureId: String!, $messageId: ID!) {
    deleteMessage(lectureId: $lectureId, messageId: $messageId) {
      lectureId
      messageId
      userId
      usertype
      message
      updatedDate
      createdDate
      deletedDate
    }
  }
`;
