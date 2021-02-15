/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMessage = /* GraphQL */ `
  query GetMessage($lectureId: String!, $messageId: ID!) {
    getMessage(lectureId: $lectureId, messageId: $messageId) {
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
export const listMessageWithFilter = /* GraphQL */ `
  query ListMessageWithFilter(
    $filter: ChatFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessageWithFilter(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        lectureId
        messageId
        userId
        usertype
        message
        updatedDate
        createdDate
        deletedDate
      }
      nextToken
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages($lectureId: String!) {
    listMessages(lectureId: $lectureId) {
      lectureId
      messageId
      userId
      userName
      usertype
      message
      updatedDate
      createdDate
      deletedDate
    }
  }
`;
