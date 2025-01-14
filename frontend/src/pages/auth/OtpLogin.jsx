import { Button, Form, Input } from 'antd';
import React from 'react'
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const OtpLogin = () => {
  const { logIn, loading, error } = useAuth('/otp/request-otp'); // Destructure logIn, loading, and error from the hook
  const [form] = Form.useForm(); // Create a form instance for the Antd form
  const navigate = useNavigate(); // To navigate after successful login

  // Handle form submission
  const handleLogin = async (values) => {
    const res = await logIn(values);
    
    console.log(res)// Call logIn with form values
    if (res) {
      
      navigate('/auth/verify-otp') // Navigate to dashboard on success (or another route)
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

        {/* Display error if any */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin} // Handle form submission
          className="space-y-3"
        >

          {/* <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item> */}


          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email address!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input placeholder="Email address" />
          </Form.Item>

         


          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loading} // Disable button and show loading indicator while logging in
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default OtpLogin