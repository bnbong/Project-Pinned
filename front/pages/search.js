import { AuthContext } from "@/contexts/AuthContext";
import Link from 'next/link';
import { useContext } from 'react';

export default function SearchPage(){
    const { user } = useContext(AuthContext);
    const userId = "최수용";
    const path = "";
    return(
        <div>
            <h4>Search Page</h4>
            <Link href={userId === user.id ? '/mypage' : `/user/${userId}`}>
                클릭 = User 이동 로직
            </Link>
        </div>
    )
}