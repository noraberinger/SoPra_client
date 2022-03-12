import React, {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";


const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login input"
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const Editor = props => {
    const history = useHistory();
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(null);
    const [birthday, setBirthday] = useState(null);

    const doFetchUser = async () => {
        try {
            const response = await api.get('/users/'+id);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUser(response.data);
            setUsername(user.username);
            setBirthday(user.birthday);
            const userSend = username;
            const userBirthday = birthday;
            return userSend, userBirthday;
        } catch (error) {
            alert(`Something went wrong during the update: \n${handleError(error)}`);
        }
    };

    useEffect(() => {
        async function fetchData() {
            const response = await api.get('/users/'+id);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUser(response.data);
            setUsername(user.username);
            setBirthday(user.birthday);
            const userSend = username;
            const userBirthday = birthday;
        }
        fetchData();
    }, []);

    const doEditUsername = async () => {
        if (localStorage.getItem('id') == id) {
            try {
                const requestBody = JSON.stringify({id, username, birthday});
                await api.put('/users/username/'+id, requestBody);
                history.push('/game/profile/'+id);
            } catch (error) {
                alert(`Something went wrong during the update of the username: \n${handleError(error)}`);
            }
        }
        else {
            alert(`You can only edit your own profile!`);
        }
    };

    const doEditBirthday = async () => {
        if (localStorage.getItem('id') == id) {
            try {
                const requestBody = JSON.stringify({id, username, birthday});
                await api.put('/users/birthday/' + id, requestBody);
                history.push('/game/profile/' + id);
            } catch (error) {
                alert(`Something went wrong during the update of the birthday: \n${handleError(error)}`);
            }
        }
        else {
                alert(`You can only edit your own profile!`);
        }
    };

    const goBack = async () => {
        try { history.push(`/game`); }
        catch (error) { alert(`Something went wrong during the change: \n${handleError(error)}`); }
    }

    return (
        <BaseContainer>
            <div className="login container">
                <div className="login form">
                    <FormField
                        label="Username"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label="birthday, format: year-month-day"
                        value={birthday}
                        onChange={b => setBirthday(b)}
                    />
                    <div className="login button-container">
                        <Button
                            disabled={!username}
                            width="100%"
                            onClick={() => doEditUsername()}
                        >
                            Save username
                        </Button>
                        &nbsp;
                        <Button
                            disabled={!birthday}
                            width="100%"
                            onClick={() => doEditBirthday()}
                        >
                            Save Birthday
                        </Button>
                        &nbsp;
                        <Button
                            width="100%"
                            onClick={() => goBack()}
                        >
                            Return
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Editor;