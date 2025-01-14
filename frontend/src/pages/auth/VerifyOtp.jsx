import { Button, Form, Input } from 'antd'
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';



const VerifyOtp = () => {
  const { logIn, loading, error, refreshAccessToken } = useAuth('/otp/verify-otp'); // Destructure logIn, loading, and error from the hook
  const [form] = Form.useForm(); // Create a form instance for the Antd form
  const navigate = useNavigate(); // To navigate after successful login

  // Handle form submission
  const handleLogin = async (values) => {
    const { success } = await logIn(values); // Call logIn with form values
    if (success) {
      console.log(success)
      navigate('/') // Navigate to dashboard on success (or another route)
    }
  };


  return (
    <div className="h-screen px-4 py-16 md:p-16">

      <div className="md:max-w-md mx-auto md:p-12 p-6 bg-[#f5f5f5] rounded">
        <div className='flex justify-end'>
          <Button href="/" />

        </div>
        <div className='mt-5'>

          <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>


        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
    onFinish={handleLogin}
          className="space-y-3"
        >
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: "Please input your OTP number!" },
              {
                type: "otp",
                message: "Please enter a valid OTP number!",
              },
            ]}
          >
            <Input.OTP  />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" >
             Login With OTP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default VerifyOtp