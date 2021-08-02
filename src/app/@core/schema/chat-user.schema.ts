export interface User {
    userID: string
    messages: Message[]
    hasNewMessage: boolean
    username: string
    self: boolean,
    connected: boolean
  }

  export interface Message {
    content: string,
    fromSelf: boolean,
    upperDate?: string,
    createdAt?: Date,
    files?: string[]
  }
