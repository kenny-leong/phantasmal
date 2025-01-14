import { React } from "react";
import placeholder from '../../static/placeholder.webp';
import './ServerSidebar.css'

const ServersSidebarItem = ({ server }) => {
    let names = (server.name).split(' ');
    let serverName = []
    for (let name of names) {
        serverName.push(name[0]);
    }
    serverName = serverName.join('')
    let className = '';
    let hasImage = false;

    if (server.server_picture === 'image.url' || server.server_picture === '') {
        className = 'server-sidebar-no-img-icon'
    } else {
        className = 'server-sidebar-icon';
        hasImage = true;
    }

    return (
        // each item will redirect to channel component
        <div className={className}>
            {hasImage ? <img src={server.server_picture} alt='preview' onError={(e) => {
                e.target.onerror = null; // reset the event handler to prevent infinite loop
                e.target.src = placeholder;
          }} /> : <p>{serverName}</p>}
        </div>
    )

}


export default ServersSidebarItem
