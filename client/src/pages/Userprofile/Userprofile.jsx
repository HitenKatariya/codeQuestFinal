import './Userprofile.css';
import React, { useState, useEffect } from 'react';
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '../../Comnponent/Avatar/Avatar';
import Editprofileform from './Edirprofileform';
import Profilebio from './Profilebio';
import LoginHistory from './LoginHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBirthdayCake, faPen } from '@fortawesome/free-solid-svg-icons';
import { fetchallusers } from '../../action/users';
import { fetchCurrentUser } from '../../action/fetchCurrentUser';
import axios from 'axios';

const Userprofile = ({ slidein }) => {
  const { id } = useParams();
  const [Switch, setswitch] = useState(false);
  const dispatch = useDispatch();

  const users = useSelector((state) => state.usersreducer);
  const currentprofile = users.filter((user) => user._id === id)[0];
  const currentuser = useSelector((state) => state.currentuserreducer);

  useEffect(() => {
    if (!Switch) {
      dispatch(fetchallusers());
    }
  }, [Switch, dispatch]);

  const handleAddFriend = async () => {
    try {
      await axios.post('http://localhost:5000/user/addfriend', {
        userId: currentuser?.result?._id,
        friendId: currentprofile._id
      });
      
      // Get the updated user data
      const { data } = await axios.get(`http://localhost:5000/user/${currentuser?.result?._id}`);
      
      // Update Redux and localStorage
      dispatch({ type: "FETCH_CURRENT_USER", payload: { result: data } });
      const currentProfile = JSON.parse(localStorage.getItem("Profile"));
      localStorage.setItem("Profile", JSON.stringify({
        ...currentProfile,
        result: data
      }));
      
      // Refresh all users
      dispatch(fetchallusers());
      
      alert('Friend added successfully! You can now post in Public Space.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding friend');
    }
  };

  if (!currentprofile) {
    return <div>Loading profile...</div>;
  }

  console.log('currentprofile:', currentprofile); // Debug log

  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein} />
      <div className="home-container-2">
        <section>
          {/* Hide user details and edit button when editing */}
          {!Switch && (
            <div className="user-details-container">
              <div className="user-details">
                {currentprofile?.avatar ? (
                  <img
                    src={
                      currentprofile.avatar.startsWith('http')
                        ? currentprofile.avatar
                        : `http://localhost:5000${currentprofile.avatar}`
                    }
                    alt="avatar"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #ccc'
                    }}
                  />
                ) : (
                  <Avatar
                    backgroundColor="purple"
                    color="white"
                    fontSize="50px"
                    px="40px"
                    py="30px"
                  >
                    {currentprofile?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                )}
                <div className="user-name">
                  <h1>{currentprofile?.name}</h1>
                  <p>
                    <FontAwesomeIcon icon={faBirthdayCake} /> Joined{' '}
                    {moment(currentprofile?.joinedon).fromNow()}
                  </p>
                </div>
              </div>
              {currentuser?.result?._id === id && (
                <button
                  className="edit-profile-btn"
                  type="button"
                  onClick={() => setswitch(true)}
                >
                  <FontAwesomeIcon icon={faPen} /> Edit Profile
                </button>
              )}
            </div>
          )}
          <>
            {Switch ? (
              <Editprofileform
                currentuser={currentuser}
                setswitch={setswitch}
              />
            ) : (
              <>
                <Profilebio currentprofile={currentprofile} />
                {currentuser?.result?._id === id && (
                  <LoginHistory userId={id} />
                )}
                {currentuser?.result?._id !== id && !currentuser?.result?.friends?.includes(currentprofile._id) && (
                  <button className="edit-profile-btn" type="button" onClick={handleAddFriend}>
                    Add Friend
                  </button>
                )}
                {/* Friend List */}
                <div className="friend-list-section" style={{marginTop: '20px'}}>
                  <h3>Friends</h3>
                  {console.log('currentprofile.friends:', currentprofile.friends)}
                  {currentprofile.friends && currentprofile.friends.length > 0 ? (
                    <ul style={{listStyle: 'none', padding: 0}}>
                      {users.filter(u => currentprofile.friends.some(fid => String(fid) === String(u._id))).map(friend => (
                        <li key={friend._id} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                          {friend.avatar ? (
                            <img src={friend.avatar.startsWith('http') ? friend.avatar : `http://localhost:5000${friend.avatar}`} alt="avatar" style={{width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px'}} />
                          ) : (
                            <Avatar backgroundColor="purple" color="white" fontSize="16px" px="10px" py="5px">{friend.name?.charAt(0)?.toUpperCase()}</Avatar>
                          )}
                          <span>{friend.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No friends yet.</p>
                  )}
                </div>
              </>
            )}
          </>
        </section>
      </div>
    </div>
  );
};

export default Userprofile;