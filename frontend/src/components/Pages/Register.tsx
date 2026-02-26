import { useState } from 'react';
import axios from 'axios';
import  '../../styles/pages/Login.css';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
    //const [email, setEmail] = useState('');
    //const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; userName?: string; password?: string; confirmPassword?: string; general?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
    })

    function handleLogin() {
        navigate('/');
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setFormData({...formData, [name]: value });

        // Clear error for this field when user starts typing
        setErrors({ ...errors, [name]: undefined });

        if (name === "email" && value.length > 0) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                setErrors({ ...errors, email: 'Invalid email' });
            } else {
                setErrors({ ...errors, email: undefined });
            }
        }

        if (name === "password" && value.length > 0) {
            if (value.length < 8) {
                setErrors({ ...errors, password: 'Password must be at least 8 characters.'});
            } else if (!/[A-Z]/.test(value)) {
                setErrors({ ...errors, password: 'Password must contain an uppercase letter.'});
            } else if (!/[0-9]/.test(value)) {
                setErrors({ ...errors, password: 'Password must contain a number.'});
            } else {
                setErrors({ ...errors, password: undefined });
            }
        }

        // Confirm Password validation
        if ((name === "password" || name === "confirmPassword") && formData.confirmPassword.length > 0) {
            if (value !== formData.confirmPassword && name === "password") {
            setErrors({ ...errors, confirmPassword: 'Passwords do not match.' });
            } else if (formData.password !== value && name === "confirmPassword") {
            setErrors({ ...errors, confirmPassword: 'Passwords do not match.' });
            } else if (formData.password === value || value === formData.password) {
                setErrors({ ...errors, confirmPassword: undefined });
            } else {
                setErrors({ ...errors, confirmPassword: undefined });
            }
        }
    }


    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); //prevent form reloading page
        setIsLoading(true); //Start loading state
        setErrors({}); //Clear previous errors

        // Validation
        const newErrors: { email?: string; userName?: string; password?: string; confirmPassword?: string} = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email.';
        }

        // Username validation
        if (!formData.userName) {
            newErrors.userName = 'Username is required.';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain an uppercase letter.';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain a number.';
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password.';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        // Check if there are any errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            // Remove confirmPassword before sending to server
            const { confirmPassword, ...copy } = formData;

            //ex. of handling array in form data submit
            //copy.powers = copy.powers.split(',');

            console.log(copy);

            let res = await axios.post('http://localhost:3000/api/auth/register', copy);

            // Store token if provided
            if (res.data.accessToken) {
                localStorage.setItem('accessToken', res.data.accessToken);
            }

            //handle response
            console.log(res.data);
            navigate('/home');

        } catch(err: any) {
            setErrors({ general: err.response?.data.message || 'Registration failed. Please try again.'});
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
                <h2>Join TradeCircle</h2>
                {/*Setting error text styling*/}
                {errors && <p style={{ color: 'red' }}>{errors.general}</p>}
                <div className='email-input-container'>
                    <label htmlFor='email'>Email</label>
                    {/* Error message appears above password input */}
                    {errors && <p className='error-message'>{errors.email}</p>}
                    <input 
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='username-input-container' style={{position: "relative", width: "70%"}}>
                    <label htmlFor='userName'>Username</label>
                    {/* Error message appears above password input */}
                    {errors && <p className='error-message'>{errors.userName}</p>}
                    <input 
                        type='text'
                        id='userName'
                        name='userName'
                        value={formData.userName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='password-input-container'>
                    <label htmlFor='password'>Password</label>
                    {/* Error message appears above password input */}
                    {errors && <p className='error-message'>{errors.password}</p>}
                    <input 
                        type='password'
                        id='password'
                        name='password'
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
                <div className='confirmPassword-input-container' style={{position: "relative", width: "70%"}}>
                    <label htmlFor='password'>Confirm Password</label>
                    {/* Error message appears above password input */}
                    {errors && <p className='error-message'>{errors.confirmPassword}</p>}
                    <input 
                        type='password'
                        id='confirmPassword'
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    /> 
                    <button
                        type='button'
                        className='password-toggle-btn'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <button className='submit-btn' type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign up'}
                </button>
                <div className='register-link-container'>
                <p>Already have an account? <a onClick={handleLogin} style={{ cursor: 'pointer' }}>Login</a></p>
                </div>
            </form>        
        </div>
    );
}