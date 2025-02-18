import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getFriendRequests, getNonFriends, addFriendUsername } from "../../store/friends";
import { useHistory } from "react-router-dom";
import { io } from 'socket.io-client';
import friendpic from '../../static/add-friends.png';
import './AddFriend.css';


let socket;

function AddFriend() {
    const dispatch = useDispatch()

    const currentUser = useSelector(state => state.session.user);
    const pendingFriends = useSelector(state => state.friends.pendingReqs);
    const strangers = useSelector(state => state.friends.strangers);
    const [usertag, setUserTag] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const history = useHistory();

    useEffect(() => {
        dispatch(getNonFriends())
        dispatch(getFriendRequests(currentUser.id));
    }, [dispatch, currentUser.id])


    useEffect(() => {
        socket = io();

        // when component unmounts, disconnect
        return (() => socket.disconnect())
    }, [dispatch, currentUser])


    if (!currentUser || !pendingFriends || !strangers) {
        return (
            <div className='loading-animation'>
                <div className="center">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                </div>
            </div>
        )
    }


    // handles getting all friends
    const openAllFriends = () => {
        history.push(`/channels/@me`);
    }

    // handles getting all friend suggestions
    const openSuggestions = () => {
        history.push(`/friends/suggestions`);
    }

    // handles getting pending requests
    const openPending = () => {
        history.push(`/friends/pending`);
    }

    // send friend request thru username
    const sendReq = async () => {
        setError('');
        setSuccess('')
        await dispatch(addFriendUsername(currentUser.id, usertag))
            .then((res) => {
                if (res.message.includes('Hm') || res.message.includes('already')) {
                    setError(res.message)
                } else {
                    setSuccess(res.message)
                }
            });
        setUserTag('');
    }

    const openExplore = () => {
        history.push(`/explore/servers`)
    }


    return (
        <div className='friendslist-container'>
            <div className="spacing-add-friend pending">
                <div className='friendslist-header-container'>
                    <i className="fa-solid fa-user-group" />
                    <div className='friendslist-friends'> Friends </div>
                    <div className="friendlist-opts">
                        <div className='friendslist-all pend' onClick={openAllFriends}> All </div>
                        <div className='friendslist-pending add' onClick={openPending}>
                            <span>Pending</span>
                            {pendingFriends.length > 0 && (
                                <div className="red-bg-amt">
                                    <span className="num-strangers">{pendingFriends.length}</span>
                                </div>
                            )}
                        </div>
                        <div className='friendslist-sugg pend' onClick={openSuggestions}>
                            <span>Suggestions</span>
                            <div className="red-bg-amt">
                                <span className="num-strangers">{strangers.length}</span>
                            </div>
                        </div>
                        {/* <div className='friendslist-blocked pend'> Blocked </div> */}
                    </div>
                </div>
                <div className="add-friend-btn">
                    <span className="add-friend-txt">Add Friend</span>
                </div>
            </div>
            <div className='friendslist-user-container-1 add-friend'>
                <span className="title-add-friend">ADD FRIEND</span>
                <span className="add-friend-subtitle">You can add a friend with their Phantasmal tag. It's cAsE sEnSiTiVe!</span>
                <div className="friend-input-div">
                    <input
                        className="form-input user-tag"
                        type="text"
                        id="usertag"
                        name="usertag"
                        value={usertag}
                        placeholder="Enter a Username#0000"
                        required
                        onChange={(e) => setUserTag(e.target.value)}
                    />
                    <div className="send-req-btn" onClick={sendReq}>
                        <span>Send Friend Request</span>
                    </div>
                </div>
                {error && (
                    <div className="error-add-friend-div">
                        <span className="error-msg-add-friend">{error}</span>
                    </div>
                )}
                {success && (
                    <div className="success-add-friend-div">
                        <span className="success-msg-add-friend">{success}</span>
                    </div>
                )}
            </div>
            <div className="other-places">
                <span className="other-places-title">OTHER PLACES TO MAKE FRIENDS</span>
                <div className="explore-public-servers" onClick={openExplore}>
                    <div className="pic-n-title">
                        <div className="compass-div">
                            <i className="fa-regular fa-compass"></i>
                        </div>
                        <span className="explore-server-text">Explore Public Servers</span>
                    </div>
                    <i className="fa-solid fa-chevron-right"></i>
                </div>
            </div>
            <div className="friendpic-div">
                <img src={friendpic} alt='friendpic' className="friendpic-bottom" />
                <span className="wumpus">Wumpus is waiting on friends. You don't have to though!</span>
            </div>
        </div>
    )
}



export default AddFriend;
