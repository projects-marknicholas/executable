import { Link } from 'react-router-dom';

// Components
import PageTransition from '../../../animations/page-transition';

// Assets
import GetStartedSvg from '../../../assets/svg/get-started.svg';

// CSS
import '../../../assets/css/user/app.css';

const UserGetStarted = () => {
  return(
    <>
      <PageTransition>
        <div className="user">
          <div className="get-started">
            <div className='header'>
              <img src={GetStartedSvg}/>
            </div>
            <div className='description'>
              <h1>Your Daily Disease Monitoring</h1>
              <p>Start your journey to a healthier tomorrow with App Name. Track your health and your family's well-being with ease.</p>
            </div>
            <div className='bottom'>
              <Link to='/user/'>Get Started</Link>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
}

export default UserGetStarted;