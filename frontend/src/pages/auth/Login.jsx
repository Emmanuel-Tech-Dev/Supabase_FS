import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { login } from '../../services/PostRequests/apis';

const Login = () => {
 // Destructure logIn, loading, and error from the hook
  const [form] = Form.useForm(); // Create a form instance for the Antd form
  const navigate = useNavigate(); // To navigate after successful login

  // Handle form submission
  const handleLogin = async (values) => {
    const res = await login(values); // Call logIn with form values
    if (res) {
     console.log(res) // Navigate to dashboard on success (or another route)
    }
  };




  

  return (
    <div className="h-screen px-4 py-16 md:p-16">
      <div className="md:max-w-md mx-auto md:p-12 p-6 bg-[#f5f5f5] rounded">
        <div className="flex justify-end">
          <Button href="/" />
        </div>

        <div className="mt-5">
          <img
            src="../image/cornet.png"
            alt="logo"
            className="w-32 mx-auto mb-5"
          />
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome User</h2>
          <h2 className="font-bold mb-6 text-center">Login</h2>
        </div>

      
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin} // Handle form submission
          className="space-y-3"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email address!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input placeholder="Email address" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <div>
            <Link
              to="/auth/reset-password"
              className="text-blue-500 font-semibold text-xs flex justify-end items-end"
            >
              Forgot password?
            </Link>
          </div>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
             // Disable button and show loading indicator while logging in
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
