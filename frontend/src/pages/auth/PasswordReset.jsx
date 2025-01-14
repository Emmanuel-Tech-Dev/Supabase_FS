import { Button, Form, Input } from "antd"



const PasswordReset = () => {
  return (
    <div className="h-screen px-4 py-16 md:p-16">

      <div className="md:max-w-md mx-auto md:p-12 p-6 bg-[#f5f5f5] rounded">
        <div className='flex justify-end'>
          <Button href="/" />

        </div>
        <div className='mt-5'>
          
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        

        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}

          className="space-y-3"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email address!" },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input placeholder="Email address" />
          </Form.Item>
         
          <Form.Item>
            <Button block type="primary" htmlType="submit" >
              Request Link
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default PasswordReset