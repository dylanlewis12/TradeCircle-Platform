import { useState } from 'react';
import axios from 'axios';
import  '../styles/pages/Login.css';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/authContext/AuthContext';
import logo from '../styles/images/logo.png';
import toast from 'react-hot-toast'; 
import API_BASE_URL from '../config/api';


export default function Login() {
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
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
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

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

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            let copy = {...formData}
            console.log(copy);

            let res = await axios.post(`${API_BASE_URL}/api/auth/login`, copy);
            console.log(res.data);

            await login(copy);
            
            toast.success("Logged in successfully!");

            setTimeout(() => {
                navigate('/home');
            }, 1000);            

        } catch(err: any) {
            /*
            if(err.response.status == 500) {
                setErrors({ general: 'Login failed. Please try again'});
            } else {
            setErrors({ general: err.response?.data.message});
            }
            */
            toast.error('Login failed. Please try again')
            console.log(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return( 
        <div className='login-container'>
            <div className='login-pane login-pane--left'>
                <img src={logo} alt='logo'/>
            </div>
            <div className='login-divider'></div>
            <form onSubmit={handleSubmit} className='login-pane login-pane--right'>
                <h2>Welcome to TradeCircle</h2>

                {errors.general && <p className='login-error-message'>{errors.general}<br /></p>}

                <div className='login-email-container'>
                    <label htmlFor='email'>Email</label>
                    {errors.email && <p className='login-error-message'>{errors.email}</p>}
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
                <div className='login-password-container'>
                    <label htmlFor='password'>Password</label>
                    {errors.password && <p className='login-error-message'>{errors.password}</p>}
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
                        className='login-password-toggle'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <button className="login-submit-btn" type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <div className='login-register-link'>
                    <p>Don't have an account? <a onClick={handleRegister} style={{ cursor: 'pointer' }}>Sign up</a></p>
                </div>
            </form>        
        </div>
    );
}