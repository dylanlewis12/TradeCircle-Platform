import { useState } from 'react';
import axios from 'axios';
import  '../styles/pages/Register.css';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../styles/images/logo.png';
import toast from "react-hot-toast";
import API_BASE_URL from '../config/api';


export default function Register() {
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
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

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

            console.log(copy);

            let res = await axios.post(`${API_BASE_URL}/api/auth/register`, copy);

            // Store token if provided
            if (res.data.accessToken) {
                localStorage.setItem('accessToken', res.data.accessToken);
            }

            console.log(res.data);

            toast.success('Account created successfully!');

            navigate('/home');

        } catch(err: any) {
            toast.error('Registration failed. Please try again.');
            //setErrors({ general: err.response?.data.message || 'Registration failed. Please try again.'});
            console.log(err.message);
        } finally {
            setIsLoading(false);
        }
    }
    
    return( 
        <div className='register-container'>
            <div className='register-pane register-pane--left'>
                <img src={logo} alt='logo'/>
            </div>
            <div className='register-divider'></div>
            <form onSubmit={handleSubmit} className='register-pane register-pane--right'>
                <h2>Join TradeCircle</h2>
                {errors.general && <p className='register-error-message'>{errors.general}</p>}
                
                <div className='register-email-container'>
                    <label htmlFor='email'>Email</label>
                    {errors.email && <p className='register-error-message'>{errors.email}</p>}
                    <input 
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className='register-username-container'>
                    <label htmlFor='userName'>Username</label>
                    {errors.userName && <p className='register-error-message'>{errors.userName}</p>}
                    <input 
                        type='text'
                        id='userName'
                        name='userName'
                        value={formData.userName}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className='register-password-container'>
                    <label htmlFor='password'>Password</label>
                    {errors.password && <p className='register-error-message'>{errors.password}</p>}
                    <input 
                        type={showPassword ? "text" : "password"}
                        id='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type='button'
                        className='register-password-toggle'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                
                <div className='register-confirm-password-container'>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    {errors.confirmPassword && <p className='register-error-message'>{errors.confirmPassword}</p>}
                    <input 
                        type={showConfirmPassword ? "text" : "password"}
                        id='confirmPassword'
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    /> 
                    <button
                        type='button'
                        className='register-password-toggle'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                
                <button className='register-submit-btn' type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing up...' : 'Sign up'}
                </button>
                
                <div className='register-login-link'>
                    <p>Already have an account? <a onClick={handleLogin} style={{ cursor: 'pointer' }}><b>Login</b></a></p>
                </div>
            </form>        
        </div>
    );
}