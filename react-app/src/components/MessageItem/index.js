import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createReactionThunk, deleteReactionThunk } from '../../store/message';
import { useParams } from 'react-router-dom';
import './MessageItem.css';
import './Reaction.css'
import EmojisModal from '../EmojisModal/AllEmojisModal';

function MessageItem({ message }) {

    const dispatch = useDispatch()

    let allServers = useSelector(state => state.server.allUserServers);
    let { serverId } = useParams();

    let serverMembersArr;
    if (!allServers) return null;
    serverMembersArr = allServers[serverId]["members"];

    // normalize serverMembers to allow for keying to get sending user
    let serverMembers = {};
    serverMembersArr.forEach(member => {
        serverMembers[member.id] = member;
    });

    // get the sending user from normalized serverMembers
    let user = serverMembers[message.userId];

    // convert timestamp to a Date object to an ISO string, slice to get the date
    let messageTimestampDate = new Date(message.timestamp).toISOString().slice(0, 10);
    let messageTimestampTime = new Date(message.timestamp).toISOString().slice(11, 16);
    let messageTimestamp = `${messageTimestampDate} ${messageTimestampTime}`;

    let reactionsArr = Object.values(message.reactions);

    let [messageId, userId] = [message.id, user.id]
    let props = {messageId, userId}
    let emojiId

    // if a reaction is not yours you can click on a reaction to add one
    const addReaction = async (userId, messageId, emojiId ) => {
        let addedReaction = await dispatch(createReactionThunk(userId, messageId, emojiId))
        return addedReaction
    }

    // if a reaction is yours, you can click on a reaction and delete it
    const deleteReaction = async (reactionId, messageId) => {
        let deleted_reaction = await dispatch(deleteReactionThunk(reactionId, messageId))
        return deleted_reaction
    }


    // if the reaction with that emoji already exists, and it's not yours, only increase the count and highlight
    let emojisCount = {}

    reactionsArr.map((reaction) => {
        if (emojisCount[reaction.emojiURL] === undefined ) {
            emojisCount[reaction.emojiURL] = 1
        }
        else {
            emojisCount[reaction.emojiURL] += 1
            // emojisCount[reaction.emojiURL]['users'].push(reaction.userId)
        }

    })

    console.log('emojiscount arr', emojisCount)

    // reactionsArr.map((reaction) => console.log(userId === reaction.userId))

    return (
        <div className='message-item'>
            <div className='message-left-and-center'>
                <div className='message-left-side'>
                    <img className='message-profile-pic' src={`${user.prof_pic}`} alt={`${user.username.slice(0, -5)} Profile Pic`} />
                </div>
                <div className='message-center'>
                    <div className='message-sender'>
                        <p className='message-username'>{user.username.slice(0, -5)}</p>
                        <p className='message-timestamp'>{messageTimestamp}</p>
                    </div>
                    <div className="message-content">
                        <p>{message.content}</p>
                    </div>
                    <div className='reactions-container'>
                    {reactionsArr.map((reaction) => {
                    return (
                        <div>
                            <div
                            className= {reaction.userId === user.id ? 'user-emoji-reaction' : 'other-user-reaction'}
                            key={`reaction${reaction.id}`}
                            onClick={reaction.userId === user.id ? () => {deleteReaction(reaction.id, messageId)} : () => {addReaction(reaction.emojiId, messageId, userId)}}
                            >
                                <p className='emojis-emojichar'> {String.fromCodePoint(reaction.emojiURL)}</p>
                                <p className='emojis-count'> {emojisCount[reaction.emojiURL]} </p>
                            </div>
                        </div>
                    );
                })}
                    </div>
                </div>
            </div>
            <div className='message-right-side'>
                <EmojisModal props={props}/>
            </div>
        </div>
    );
};




export default MessageItem;