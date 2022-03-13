import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import "styles/views/Game.scss";
import User from 'models/User';

const Player = ({user}, {on_status=user.logged_in.toString()}) => (
    <div className="player container">
        <div className="player id">id: {user.id},</div>
        <div className="player username">username: {user.username},</div>
        <div className="player creation_date">creation_date: {user.creation_date},</div>
        <div className="player logged_in">logged_in: {on_status},</div>
        <div className="player birthday">birthday: {user.birthday?.toString() || 'N/A'}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object,
    on_status: PropTypes.string
};

const Profile = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();
    //const [birthday, setBirthday] = useState(null);
    //const [logged_in, setLogged_in] = useState(null);
    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [user, setUsers] = useState(null);
    const {id} = useParams();

    const logout = async () => {
        console.log(localStorage);
        localStorage.removeItem('token');
        //id key can't be updated but username can, hence id key seems to be the safer choice
        try { const response = await api.put('/users/'+localStorage.getItem('id')+'/logout'); }
        catch (error) { alert(`Something went wrong during the logout: \n${handleError(error)}`); }
        history.push('/login');
    }

    const goBack = async () => {
        try {
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong during the change: \n${handleError(error)}`);
        }
    }

    const goEdit = async () => {
        if (localStorage.getItem('id') == id) { history.push('/edit/'+ id); }
        else { alert("Can only edit your own profile");}
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users/'+id);

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUsers(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();

    }, []);


    let content = <Spinner/>;

    if (user) {
        content = (
            <div className="game">
                <ul className="game user-list">
                    <Player user={user} key={user.id}/>
                </ul>
                <Button
                    width="100%"
                    onClick={() => goEdit()}
                >
                    Edit
                </Button>
                &nbsp;
                <Button
                    width="100%"
                    onClick={() => goBack()}
                >
                    Return
                </Button>
                &nbsp;
                <Button
                    width="100%"
                    onClick={() => logout()}
                >
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <BaseContainer className="game container">
            <h2>Happy Coding!</h2>
            <p className="game paragraph">
                Profile:
            </p>
            {content}
        </BaseContainer>
    );
}

export default Profile;