//types
const LOAD_MESSAGES = 'messages/LOAD_MESSAGES';
const ADD_MESSAGE = 'messages/ADD_MESSAGE';
const CREATE_REACTION = 'emojis/CREATE_REACTION'
const DELETE_REACTION = 'emojis/DELETE_REACTION'
// const EDIT_MESSAGE = 'messages/EDIT_MESSAGE';
const CLEAR_MESSAGES = 'messages/CLEAR_MESSAGES'

// POJO action creators:
const loadMessages = messages => ({
  type: LOAD_MESSAGES,
  messages
});

const addMessage = message => ({
  type: ADD_MESSAGE,
  message
});

const createReaction = (reaction) => ({
  type: CREATE_REACTION,
  reaction
})

const deleteReaction = (reactionId, messageId) => ({
  type: DELETE_REACTION,
  reactionId,
  messageId
})

export const clearMessages = () => ({
  type: CLEAR_MESSAGES
})

// thunk action creators:
export const getChannelMessages = (channelId) => async (dispatch) => {

  let resMessages;
  try {
    resMessages = await fetch(`/api/channels/${channelId}/messages`);
  } catch (error) {
    console.error('Failed to fetch channel messages', error)
  }
  if (resMessages.ok) {
      const channelMessages = await resMessages.json();
      dispatch(loadMessages(channelMessages));
      return channelMessages;
    }
};



export const createMessage = (message) => async dispatch => {
  const resMessage = await fetch(`/api/messages`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });

  if (resMessage.ok) {
    const message = await resMessage.json();
    dispatch(addMessage(message));
    return message;
  }
};

export const createReactionThunk = (emoji, messageId, userId) => async dispatch => {
  const response = await fetch("/api/emojis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 'emojiId': emoji, 'messageId': messageId, 'userId': userId })
  })

  if (response.ok) {
    const newReaction = await response.json();
    dispatch(createReaction(newReaction))
    return newReaction
  }

}


export const deleteReactionThunk = (reactionId, messageId) => async dispatch => {
  const response = await fetch(`/api/emojis/${reactionId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })

  if (response.ok) {
    dispatch(deleteReaction(reactionId, messageId))
    return ('successfully deleted!')
  }
}


// initial state for reducer:
const initialState = {};

// reducer:
const messageReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case LOAD_MESSAGES:
      const messagesArr = Object.values(action.messages);
      messagesArr.forEach(message => {
        newState[message.id] = message;
      });
      return newState;
    case ADD_MESSAGE:
      newState = { ...state };
      newState[action.message.id] = action.message;
      return newState;
    case CREATE_REACTION:
      newState = { ...state }
      newState[action.reaction.messageId].reactions.push(action.reaction);
      return newState
    case DELETE_REACTION:
      newState = { ...state }
      delete newState[action.messageId].reactions[action.reactionId]
      return newState
    case CLEAR_MESSAGES:
      newState = {}
      return newState;

    default:
      return state;
  }
}

export default messageReducer;
