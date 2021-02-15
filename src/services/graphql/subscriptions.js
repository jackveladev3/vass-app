/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($lectureId: String) {
    onCreateMessage(lectureId: $lectureId) {
      lectureId
      messageId
      userId
      usertype
      message
      updatedDate
      createdDate
      deletedDate
      userName
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage($lectureId: String) {
    onUpdateMessage(lectureId: $lectureId) {
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
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage($lectureId: String) {
    onDeleteMessage(lectureId: $lectureId) {
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
