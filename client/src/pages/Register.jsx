import React from 'react'
import { useState } from 'react'

const Register = () => {
    const [formData, setFormdata] = useState({
        name: '',
        email: '',
        password: ''
    });
    const handleChange = (e) => {
        setFormdata({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            
        } catch (error) {
           toast.error(error.response?.data?.message || 'Registration failed') 
        }
    }
    return (
        <div>Register</div>
    );
}

export default Register