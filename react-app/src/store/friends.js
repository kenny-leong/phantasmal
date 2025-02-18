

// Action Creators
const getFriends = (friends) => ({
  type: "GET_ALL_FRIENDS",
  friends
});

const getStrangers = (strangers) => ({
  type: "GET_NON_FRIENDS",
  strangers
});

const loadFriendRequests = (pendingFriends) => ({
  type: 'GET_FRIEND_REQUESTS',
  pendingFriends
});

// const  addFriend = (friend) => ({
//   type: ADD_FRIEND,
//   friend
// })

// const deleteFriend = () => ({
//   type: DELETE_FRIEND
// })


// *************************** Thunks ***********************************

// GET ALL USER'S FRIENDS
export const getUserFriends = (userId) => async (dispatch) => {
  const response = await fetch(`/api/friends/users/${userId}`)

  if (response.ok) {
    const friendObjs = await response.json();
    dispatch(getFriends(friendObjs.friends));
    return friendObjs.friends
  }
}

// GET ALL STRANGERS
export const getNonFriends = () => async (dispatch) => {
  const response = await fetch(`/api/friends/users/not_friends`)

  if (response.ok) {
    const nonFriends = await response.json();
    dispatch(getStrangers(nonFriends.non_friends));
    return nonFriends.non_friends;
  }
}

// SEND A FRIEND REQUEST THRU SUGGESTIONS
export const sendFriendReq = (currUserId, friendId) => async (dispatch) => {
  const response = await fetch(`/api/friends/users/${friendId}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currUserId })
  });

  if (response.ok) {
    const resMsg = await response.json();
    return resMsg;
  }
};

//SEND A FRIEND REQUEST THRU ADD FRIEND BUTTON
export const addFriendUsername = (currUserId, username) => async (dispatch) => {
  const response = await fetch(`/api/friends/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, currUserId })
  });

  if (response.ok) {
    const resMsg = await response.json();
    return resMsg;
  }
};


// ACCEPT A FRIEND REQUEST
export const acceptFriendRequest = (currUserId, friendId) => async (dispatch) => {
  const response = await fetch(`/api/friends/users/${friendId}/accept`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currUserId })
  });

  if (response.ok) {
    const acceptRes = await response.json();
    return acceptRes
  }
}


// GET ALL FRIEND REQUESTS FOR CURRENT USER
export const getFriendRequests = (currUserId) => async (dispatch) => {
  const response = await fetch(`/api/friends/requests/${currUserId}`)

  if (response.ok) {
    const friendReqs = await response.json();
    dispatch(loadFriendRequests(friendReqs.friend_requests));
    return friendReqs.friend_requests;
  }
}


// REJECT A FRIEND REQUEST OR REMOVE A FRIEND
export const removeFriendship = (friendId) => async (dispatch) => {
  const response = await fetch(`/api/friends/users/${friendId}/remove`, { method: 'DELETE' });

  if (response.ok) {
    const deleteRes = await response.json();
    return deleteRes
  }
}





// ************************** Friend Reducer ****************************

let initialState = {}

export default function friendsReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_ALL_FRIENDS":
      return {
        ...state,
        userFriends: action.friends
      }
    case 'GET_NON_FRIENDS':
      return {
        ...state,
        strangers: action.strangers
      }
    case 'GET_FRIEND_REQUESTS':
      return {
        ...state,
        pendingReqs: action.pendingFriends
      };
    default:
      return state;
  }
}
