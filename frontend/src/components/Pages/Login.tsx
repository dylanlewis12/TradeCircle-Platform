import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault(); //prevent form reloading page

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password,
            });
            //Handle successful login 
            console.log('Login successful: ', response.data);
        } catch(err) {
            setError(err.response.data.message || 'An error occurred');
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor='password'>Password</label>
                <input 
                    type='password'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /> 
            </div>
            <button type="submit">Login</button>
        </form>
        
    </>
    );
}