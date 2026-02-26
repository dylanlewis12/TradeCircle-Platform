import { useState } from 'react';
import axios from 'axios';
import  '../../styles/pages/Login.css';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/authContext/AuthContext';

export default function Login() {
    //const [email, setEmail] = useState('');
    //const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    // State to toggle password visibility (true for 'text', false for 'password')
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    function handleRegister() {
        navigate('/register');
    }


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error for this field when user starts typing
        setErrors({ ...errors, [name]: undefined });

        if (name === "email" && value.length > 0) {
            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                setErrors({ ...errors, email: 'Please enter a valid email.' });
            }
        }

        if (name === "password" && value.length > 0) {
            if (value.length < 8) {
                setErrors({ ...errors, password: 'Password must be at least 8 characters.'});
            } else if (!/[A-Z]/.test(value)) {
                setErrors({ ...errors, password: 'Password must contain an uppercase letter.'});
            } else if (!/[0-9]/.test(value)) {
                setErrors({ ...errors, password: 'Password must contain a number.'});
            }
        }
    }


    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); //prevent form reloading page
        setIsLoading(true); //Start loading state
        setErrors({}); //Clear previous errors

        // Validation
        const newErrors: { email?: string; password?: string } = {};

        if(!formData.email) {
            newErrors.email = 'Email is required.';
        }
        if(!formData.password) {
            newErrors.password = 'Password is required.';
        } else if(formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        }

        if (Object.keys(newErrors).length > 0) { //Check if there are any errors before post request
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            //Manipulate data to final state
            let copy = {...formData}

            //ex. of handling array in form data submit
            //copy.powers = copy.powers.split(',');

            console.log(copy);

            let res = await axios.post('http://localhost:3000/api/auth/login', copy);

            //handle response
            console.log(res.data);

            // Just call login with the form data - it handles the API call and stores everything
            await login(copy);

            navigate('/home');

        } catch(err: any) {
            setErrors({ general: err.response?.data.message || 'Login failed. Please try again.'});
            console.error(err);
        } finally {
            setIsLoading(false); //End loading state
        }
    }

    return( 
        <div className='container'>
            <div className='pane left'>
                <img src='logo.svg' alt='logo'/>
            </div>
            <div className='divider-line'></div>
            <form onSubmit={handleSubmit} className='pane right'>
                <h2>Welcome to TradeCircle</h2>

                {/* General form error - appears at top */}
                {errors.general && <p className='error-message'>{errors.general}<br /></p>}

                <div className='email-input-container'>
                    <label htmlFor='email'>Email</label>
                    {/* Error message appears above password input */}
                    {errors.email && <p className='error-message'>{errors.email}</p>}
                    <input 
                        type='email'
                        id='email'
                        name='email'
                        placeholder='your@email.com'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='password-input-container'>
                    <label htmlFor='password'>Password</label>
                    {/* Error message appears above password input */}
                    {errors.password && <p className='error-message'>{errors.password}</p>}
                    <input 
                        type={showPassword ? "text" : "password"}
                        id='password'
                        name='password'
                        placeholder='••••••••'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type='button'
                        className='password-toggle-btn'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <button className="submit-btn" type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <div className='register-link-container'>
                <p>Don't have an account? <a onClick={handleRegister} style={{ cursor: 'pointer' }}>Sign up</a></p>
                </div>
            </form>        
        </div>
    );
}