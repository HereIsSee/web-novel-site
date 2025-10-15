import { useState } from 'react'
import { Link } from 'react-router'
import InputField from '../components/FormFields/InputField'
import Button from '../components/FormFields/Button'

const Login = ()=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (e)=>{
        e.preventDefault();
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

                    <Button styleType="blue-white" type="submit">Sign in</Button>
                </form>

                <Link to='/register'>Create a new account</Link>
            </div>
        </div>
    );
}

export default Login;