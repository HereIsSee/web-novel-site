import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/FormFields/InputField'
import Button from '../components/FormFields/Button'
import { useToast } from '../context/useToast'
import { loginUser } from '../api/users';

const Login = ()=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { showToast } = useToast();
    const navigate = useNavigate();

    const onSubmit = async (e)=>{
        e.preventDefault();

        try {
            const response = await loginUser({
                Email: email,
                Password: password,
            });
            localStorage.setItem("token", response.token);
            
            setEmail("");
            setPassword("");
            
            showToast("Login successful!", "success");
            navigate("/");

        } catch (err) {
            console.error("Login failed:", err);
            showToast(err.message || "Login failed", "error");
        }
    }

    return(
        <div className="auth-cover cover-background">
            <div className="auth-container">
                <Link className='title' to='/'>FableBound</Link>
                <h2>Sign In</h2>
                <form onSubmit={(e)=>onSubmit(e)}>
                    <div className='form-item'>
                        <label htmlFor="login-email">Email:</label>
                        <InputField
                            id="login-email"
                            type="email" 
                            name="email"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                        />
                    </div>

                    <div className='form-item'>
                        <label htmlFor="login-password">Password:</label>
                        <InputField
                            id="login-password"
                            type="password" 
                            name="password"
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                        />
                    </div>

                    <Button styleType="blue-white-rounded" type="submit">Sign in</Button>
                </form>

                <Link to='/register'>Create a new account</Link>
            </div>
        </div>
    );
}

export default Login;