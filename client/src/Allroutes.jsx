import React from 'react'
import { Routes,Route } from 'react-router-dom'
import { useSelector } from 'react-redux';
import Home from './pages/Home/Home'
import Askquestion from './pages/Askquestion/Askquestion'
import Auth from './pages/Auth/Auth'
import Question from './pages/Question/Question'
import Displayquestion from './pages/Question/Displayquestion'
import Tags from './pages/Tags/Tags'
import Users from './pages/Users/Users'
import Userprofile from './pages/Userprofile/Userprofile'
import PublicFeed from './pages/PublicSpace/PublicFeed'
function Allroutes({slidein,handleslidein}) {
  const currentuser = useSelector((state) => state.currentuserreducer?.result);
  return (
    <Routes>
        <Route path='/' element={<Home slidein={slidein} handleslidein={handleslidein}/>}/>
        <Route path='/Askquestion' element={<Askquestion />}/>
        <Route path='/Auth' element={<Auth />}/>
        <Route path='/Question' element={<Question slidein={slidein} handleslidein={handleslidein}/>}/>
        <Route path='/Question/:id' element={<Displayquestion slidein={slidein} handleslidein={handleslidein}/>}/>
        <Route path='/Tags' element={<Tags slidein={slidein} handleslidein={handleslidein}/>}/>
        <Route path='/Users' element={<Users slidein={slidein} handleslidein={handleslidein}/>}/>
        <Route path='/Users/:id' element={<Userprofile slidein={slidein} handleslidein={handleslidein}/>}/>
        <Route path='/publicspace' element={<PublicFeed />} />
    </Routes>
  )
}

export default Allroutes