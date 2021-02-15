<template>
  <v-card class="pt-4 card-message_box" outlined style="">
    <div ref="chatArea" class="v-virtual-scroll chat-area">
      <div v-for="item in messages" :key="item.messageId">
        <div class="w-100">
          <div
            class="message-item"
            :class="item.isLoggedInUser ? 'right' : 'left'"
          >
            <div class="message-text">
              <p>
                <pre>{{ item.message }}</pre>
              </p>
              <i
                class="message-text-icon fas"
                :class="item.isLoggedInUser ? 'fa-caret-right' : 'fa-caret-left'"
              ></i>
            </div>
            <div class="w-100">
              <p class="message-name">
                {{ item.name }}&nbsp;
                <span style="font-size: 12px">
                  {{ item.isLoggedInUser ? 'あなた' : item.usertype === 2 ? "管理人" : item.userName }}
                  {{ formatDateTime(item.createdDate) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-divider></v-divider>

    <v-card-actions>
      <v-textarea
        class="mt-1 ml-3 custom_text"
        filled
        dense
        no-resize
        rows="1"
        v-model="message"
        @keydown="onSendMessage($event)"
      ></v-textarea>
      <v-btn
        class="mx-2 mb-6 ml-4 btn-outline_none"
        fab
        x-small
        dark
        color="#95a3b9"
        v-bind:class="{ '#3D5170': message == '', blue: message != '' }"
        @click="onSendMessage($event)"
      >
        <i class="fas fa-arrow-right" style="font-size: 20px"></i>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as MsgQueries from "@/services/graphql/queries";
import * as MsgMutations from "@/services/graphql/mutations";
import * as MsgSubscriptions from "@/services/graphql/subscriptions";
import axios from "axios";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";
import awsconfig from "@/utils/aws-exports";
import gql from "graphql-tag";

export default {
  name: "Messaging",
  props: {
    lectureId: String,
    userId: String,
    userType: String
  },

  async mounted() {
    const container = this.$refs.chatArea;

    this.jwtToken = this.$store.getters.getJwtToken;

    this.client = new AWSAppSyncClient({
      url: awsconfig.aws_appsync_graphqlEndpoint,
      region: awsconfig.aws_appsync_region,
      auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: this.jwtToken,
      },
      disableOffline: true
    });

    // this.newClient = await client.hydrated()
    const { data } = await this.client.query({
      query: gql(MsgQueries.listMessages),
      variables: {
        lectureId: this.lectureId,
      },
    });

    this.messages = data.listMessages.map((v) => {
      return {
        ...v,
        isLoggedInUser: v.userId === this.userId,
      };
    });
    this.messages.sort((a, b) => {
      return a.createdDate < b.createdDate ? -1 : 1;
    });
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 200);
    this.client
      .subscribe({
        query: gql(MsgSubscriptions.onCreateMessage),
        variables: {
          lectureId: this.lectureId,
        },
      })
      .subscribe({
        // Push the new items onto our listItems array for dispay
        next: (action) => {
          // that.listItems.push(action.value.data.onCreateShoppingListItem);
          const message = action.data.onCreateMessage;
          // console.log('message', message);
          if (
            this.messages.filter((v) => v.messageId === message.messageId)
              .length === 0
          ) {
            this.messages.push({
              ...message,
              isLoggedInUser: message.userId === this.userId,
            });
            setTimeout(() => {
              container.scrollTop = container.scrollHeight;
            }, 100);
          }
        },
      });
  },
  created() {
  },
  methods: {
    async onSendMessage(e) {

      let lastKeyPressedLocal = this.lastKeyPressed

      this.lastKeyPressed = e.keyCode

      if(e.keyCode != 13) return false

      if(lastKeyPressedLocal == 16 && e.keyCode == 13)
       return false

      if(lastKeyPressedLocal == 18 && e.keyCode == 13){
        this.message = `${this.message}\n`;
        return false       
      }

      // console.log('lectureId, userId, userType, userName', this.lectureId, this.userId, this.userType, this.userName);
      if (this.message !== "") {
        await this.client.mutate({
          mutation: gql(MsgMutations.createMessage),
          variables: {
            lectureId: this.lectureId,
            userId: this.userId,
            message: this.message,
            usertype: parseInt(this.userType),
          },
        });
        this.message = "";
        this.lastKeyPressed = null
      }
    },

    formatDateTime(str) {
      const date = new Date(str);

      return `${date.getFullYear()}.${
        date.getMonth() + 1
      }.${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
  },

  data() {
    return {
      message: "",
      messages: [],
      jwtToken: null,
      newClient: null,
      lastKeyPressed: null
    };
  },
};
</script>

<style scoped>
.chat-area {
  height: calc(100% - 64px);
}
.w-100 {
  width: 100%;
  display: inline-block;
}
.right .message-name {
  float: right;
}

.message-item {
  color: #898989;
  font-size: 14px;
}

.card-message_box {
  margin-top: 20px;
  height: calc(95vh - 185px);
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.message-text {
  display: flex;
  align-items: center;
}

.message-text p {
  padding: 8px 16px;
  width: fit-content;
  border-radius: 4px;
  margin-bottom: 4px;
}

.message-text-icon {
  font-size: 22px;
  transform: scaleX(2.5);
}

.right .message-text-icon {
  color: #e5f8ff;
}

.right .message-text p {
  background-color: #e5f8ff;
}

.right .message-text {
  float: right;
}

.custom_text :before {
  display: none !important;
}

.left .message-text {
  flex-direction: row-reverse;
  width: fit-content;
}

.left .message-text-icon {
  color: #f2f2f2;
}

.left .message-text p {
  background-color: #f2f2f2;
}

.right {
  width: fit-content;
  float: right;
  margin-left: 16px;
  margin-right: 16px;
}

.btn-outline_none {
  outline: none !important;
  box-shadow: none !important;
}

.left {
  margin-left: 16px;
}
</style>
