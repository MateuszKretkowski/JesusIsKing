import React, { useEffect, useState } from 'react'
import { db, findUserByEmail } from '../config/config';
interface ReplyNotifProps {
    id: string;
    postId: string;
    authorEmail: string;
    date: string;
}
function ReplyNotif({id, postId, authorEmail, date}: ReplyNotifProps) {
        const [userData, setUserData] = useState<any>(null);
        useEffect(() => {
        const fetchAuthor = async () => {
                const user = await findUserByEmail(authorEmail);
                setUserData(user);
                console.log(authorEmail, "AUTHOR EMAIL")
                console.log(userData, "uSER DATA")
                console.log(id, "ID")
        }
        fetchAuthor();
        }, []);
        return (
        <div className='replyNotif'>
            <img src={userData?.avatar} />
            <h1>{userData?.authorEmail}</h1>
        </div>
    )
}

export default ReplyNotif
