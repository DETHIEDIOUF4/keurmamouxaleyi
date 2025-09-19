import { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

type Order = {
  _id: string;
  totalPrice: number;
  isPaid?: boolean;
  isDelivered?: boolean;
  createdAt?: string;
  status?: string;
  orderItems?: any[];
  user?: any;
};

export default function Orders() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<Order | null>(null);
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/api/orders');
        const list = Array.isArray(data?.data) ? data.data : data;
        if (mounted) setItems(list);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load orders');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const fs = from ? new Date(from).getTime() : null;
    const ts = to ? new Date(to).getTime() + 24*60*60*1000 - 1 : null;
    return items.filter(o => {
      const t = o.createdAt ? new Date(o.createdAt).getTime() : 0;
      if (fs && t < fs) return false;
      if (ts && t > ts) return false;
      return true;
    });
  }, [items, from, to]);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (error) return <div style={{ padding: 16, color: 'red' }}>{error}</div>;

  const markPaid = async (id: string) => {
    await api.put(`/api/orders/${id}/pay`, {});
    const { data } = await api.get('/api/orders');
    setItems(Array.isArray(data?.data) ? data.data : data);
  };

  const markDelivered = async (id: string) => {
    await api.put(`/api/orders/${id}/deliver`, {});
    const { data } = await api.get('/api/orders');
    setItems(Array.isArray(data?.data) ? data.data : data);
  };

  const printTicket = (o: Order) => {
    const w = window.open('', '_blank');
    if (!w) return;
    const lines = [] as string[];
    lines.push(`<h3>Ticket #${o._id}</h3>`);
    lines.push(`<div>Total: ${o.totalPrice} FCFA</div>`);
    lines.push(`<div>Payée: ${o.isPaid ? 'Oui' : 'Non'}</div>`);
    lines.push(`<div>Livrée: ${o.isDelivered ? 'Oui' : 'Non'}</div>`);
    lines.push(`<div>Date: ${o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</div>`);
    w.document.write(`<html><body>${lines.join('')}<script>window.print();</script></body></html>`);
    w.document.close();
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 2 }}>Commandes</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField label="De" type="date" size="small" InputLabelProps={{ shrink: true }} value={from} onChange={(e) => setFrom(e.target.value)} />
        <TextField label="À" type="date" size="small" InputLabelProps={{ shrink: true }} value={to} onChange={(e) => setTo(e.target.value)} />
      </Stack>
      <List>
        {filtered.map((o) => (
          <ListItem key={o._id} divider secondaryAction={
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              {!o.isPaid && <Button size="small" variant="outlined" onClick={() => markPaid(o._id)}>Marquer payé</Button>}
              {!o.isDelivered && <Button size="small" variant="outlined" onClick={() => markDelivered(o._id)}>Marquer livré</Button>}
              <Button size="small" onClick={() => printTicket(o)}>Imprimer</Button>
              <Button size="small" onClick={() => setDetail(o)}>Détails</Button>
            </Stack>
          }>
            <ListItemText
              primary={<Stack direction="row" spacing={1} alignItems="center">
                <span>#{o._id}</span>
                <Chip size="small" label={`${o.totalPrice} FCFA`} />
              </Stack>}
              secondary={`Date: ${o.createdAt ? new Date(o.createdAt).toLocaleString() : ''} • ${o.isPaid ? 'Payée' : 'Non payée'} • ${o.isDelivered ? 'Livrée' : 'En cours'}`}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={!!detail} onClose={() => setDetail(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Détails commande</DialogTitle>
        {detail && (
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Typography>ID: {detail._id}</Typography>
              <Typography>Total: {detail.totalPrice} FCFA</Typography>
              <Typography>Payée: {detail.isPaid ? 'Oui' : 'Non'}</Typography>
              <Typography>Livrée: {detail.isDelivered ? 'Oui' : 'Non'}</Typography>
              <Typography>Date: {detail.createdAt ? new Date(detail.createdAt).toLocaleString() : ''}</Typography>
              {Array.isArray(detail.orderItems) && detail.orderItems.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2">Articles</Typography>
                  {detail.orderItems.map((it: any, i: number) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span>{it?.name || it?.title || 'Article'}</span>
                      <span>{it?.qty || 1} x {it?.price || 0}</span>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setDetail(null)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
