import { useState } from 'react';
import axios from 'axios';

export default function Login() {
    //const [email, setEmail] = useState('');
    //const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

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
    
    return( <>
        <div className='logo-container'>
            <img src='../../../public/logo.png' alt='logo'/>
        </div>
        <form onSubmit={handleSubmit} >
            <h2>Login</h2>
            {/*Setting error text styling*/}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor='email'>Email</label>
                <input 
                    type='email'
                    id='email'
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
                    value={formData.password}
                    onChange={handleChange}
                    required
                /> 
            </div>
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </button>
        </form>
        
    </>
    );
}