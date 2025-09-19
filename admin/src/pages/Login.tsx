import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../store/auth';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s: any) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const resp = await api.post('/api/users/login', { email, password });
      // Backend returns: { success, data: { ...userFields, role, token } }
      const payload = resp.data?.data || resp.data;
      const token = payload?.token;
      const user = {
        _id: payload?._id,
        name: [payload?.firstName, payload?.lastName].filter(Boolean).join(' ').trim(),
        email: payload?.email,
        isAdmin: payload?.role === 'admin',
      } as any;
      if (!token) throw new Error('Missing token');
      setAuth(user, token);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>Admin Login</Typography>
          <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
