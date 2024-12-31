import { useState } from 'react'
import { Button } from "..//components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from '../hooks/use-toast'

export default function Component() {
  const [searchParams] = useSearchParams();
  const token = String(searchParams.get('token'));

  const navigate = useNavigate();

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const res = await axios.patch(
        `/api/v1/user/reset-forget-password?token=${token}`,
        {
          password,
          confirmPassword,
        }
      );
      if (res.status == 200) {
        toast({
          title: "Success",
          description: res.data.message,
          variant: "success",
        });
        navigate('/')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message ?? "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create A Strong Password</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-6">
          Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="New password, again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-sky-300 hover:bg-sky-400 text-black">
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}