import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import api from '../api/api';
import { registerSuccess } from '../features/auth/authSlice';
import { toast } from 'sonner';

const Register = () => {
    const [formData, setFormdata] = useState({
        name: '',
        email: '',
        password: ''
    });
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormdata({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            dispatch(registerSuccess(res.data.user));
            toast.success('Registered successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed')
        }
    }
    return (
        <div className="max-w-md mx-auto mt-36 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" required />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
            </form>
        </div>
    );
}

export default Register