import { AuthContext } from '@/contexts/AuthContext';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';


const SettingUserThumbnail = ({ newImg, setNewImg, imgObject, setImgObject}) =>{
    const inputRef = useRef(null);
    const UploadImage = (e) => {
        if(!e.target.files) {
            return;
        }
        const file = e.target.files[0];
        setImgObject(file); // 파일 객체를 상태에 저장

        const reader = new FileReader();
        reader.onload = () => {
            const ImageDataUrl = reader.result;
            setNewImg(ImageDataUrl); // 데이터 URL을 상태에 저장
        }
        reader.readAsDataURL(file);
    }
    const UploadImageButtonClick = () => {
        if(!inputRef.current){
            return;
        }
        inputRef.current.click();
    }

    return (
        <div className="flex flex-col items-center ">
            <img
                className='w-20 h-20 rounded-full object-cover mr-5'
                src={newImg} // 이미지는 데이터 URL로 표시
            />
            <input type='file' accept='image/*' ref={inputRef} onChange={UploadImage}></input>
            <button onClick={UploadImageButtonClick}></button>
        </div>
    )   
};



export default function EditProfileModal({ isOpen, onClose, userName, setUserName, img, setImg }) {
    const {loginState, setLoginState} = useContext(AuthContext)
    const [name, setName] = useState(userName);
    const [newImg, setNewImg] = useState('');
    const [imgObject, setImgObject] = useState('');


    
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('username',name);
        formData.append('profile_image',imgObject);
        console.log('이미지 확인 = ' + imgObject);
        try{
            const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${loginState.user.user_id}/profile/`,
                    formData,
                    {
                        headers: {
                            "Authorization": `Bearer ${loginState.accessToken}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if(response.data.is_success){
                    setUserName(name);
                    setImg(newImg);
                }
        }catch (error){
            console.log(error);  
        }
        onClose();
    }
    if (!isOpen) return null;

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Edit Profile</h3>
                            <SettingUserThumbnail newImg={newImg} setNewImg={setNewImg} imgObject={imgObject} setImgObject={setImgObject} />
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button 
                            type="button" 
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={handleSubmit}
                        >
                            Save changes
                        </button>
                        <button 
                            type="button" 
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}