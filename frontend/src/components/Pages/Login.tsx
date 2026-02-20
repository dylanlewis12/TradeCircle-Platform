import { useState } from 'react';
import axios from 'axios';
import  '../../styles/pages/Login.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    //const [email, setEmail] = useState('');
    //const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    function handleRegister() {
        navigate('/register');
    }

    /*
    const validateField = (name: String, value: String) => {
        let error = '';
        if(name === 'email') {
            if(!value) { //Missing 
                error = 'Email is required';
            } else if(name === 'password') {
                if(!value) {

                }
            }
        }
    }
    */ 

    function handleChange(e: any) {
        setFormData({...formData, [e.target.name]: e.target.value });
    }


    
    async function handleSubmit(e: any) {
        e.preventDefault(); //prevent form reloading page
        setIsLoading(true); //Start loading state
        setError(null); //Clear previous errors

        try {
            //Manipulate data to final state
            let copy = {...formData}

            //ex. of handling array in form data submit
            //copy.powers = copy.powers.split(',');

            console.log(copy);

            let res = await axios.post('http://localhost:3000/api/auth/login', copy);

            //handle response
            console.log(res.data);
            navigate('/home');

        } catch(err: any) {
            //setError(err.response.data.message || 'An error occurred');
            alert(err.message);
        } finally {
            setIsLoading(false); //End loading state
        }
    }

    //Loading state button

    //Email validation function

    //Password validation function for missing fields
    
    return( 
        <div className='container'>
            <div className='pane left'>
                <img src='logo.svg' alt='logo'/>
            </div>
            <div className='divider-line'></div>
            <form onSubmit={handleSubmit} className='pane right'>
                <h2>Welcome to TradeCircle</h2>
                {/*Setting error text styling*/}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label htmlFor='email'>Email</label>
                    <input 
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input 
                        type='password'
                        id='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    /> 
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </button>
                <div className='register-link-container'>
                <p>Don't have an account? <a onClick={handleRegister}>Sign up</a></p>
                </div>
            </form>        
        </div>
    );
}