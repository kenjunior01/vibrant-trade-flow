import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, UserPlus, ShieldCheck, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  manager_id?: string;
}

export const UserManagementPanel: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<any>(null);
  const [showAssignManager, setShowAssignManager] = useState<string | null>(null);
  const [managerId, setManagerId] = useState('');
  const [showCreateManager, setShowCreateManager] = useState(false);
  const [newManager, setNewManager] = useState({ full_name: '', email: '', password: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          role: roleFilter !== 'all' ? roleFilter : '',
          status: statusFilter !== 'all' ? statusFilter : '',
          search,
        });
        const res = await fetch(`http://localhost:5000/api/admin/users?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data.users || []);
        setTotalPages(data.total_pages || 1);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUsers();
  }, [token, page, roleFilter, statusFilter, search]);

  // Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data.stats || data);
      } catch {
        setStats(null);
      }
    };
    if (token) fetchStats();
  }, [token]);

  // Toggle user status
  const handleToggleStatus = async (id: string) => {
    setActionLoading(true);
    await fetch(`http://localhost:5000/api/admin/users/${id}/toggle-status`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    setActionLoading(false);
    setUsers(users => users.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
  };

  // Assign manager
  const handleAssignManager = async (userId: string) => {
    setActionLoading(true);
    await fetch(`http://localhost:5000/api/admin/users/${userId}/assign-manager`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ manager_id: managerId }),
    });
    setActionLoading(false);
    setShowAssignManager(null);
    setManagerId('');
  };

  // Create manager
  const handleCreateManager = async () => {
    setActionLoading(true);
    await fetch('http://localhost:5000/api/admin/create-manager', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newManager),
    });
    setActionLoading(false);
    setShowCreateManager(false);
    setNewManager({ full_name: '', email: '', password: '' });
  };

  return (
    <div className="space-y-8">
      {/* Admin Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl text-white">
            <div className="text-xs text-slate-400">Usuários Ativos</div>
            <div className="text-2xl font-bold">{stats.users?.active ?? '-'}</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl text-white">
            <div className="text-xs text-slate-400">Traders</div>
            <div className="text-2xl font-bold">{stats.users?.traders ?? '-'}</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl text-white">
            <div className="text-xs text-slate-400">Managers</div>
            <div className="text-2xl font-bold">{stats.users?.managers ?? '-'}</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl text-white">
            <div className="text-xs text-slate-400">Admins</div>
            <div className="text-2xl font-bold">{stats.users?.admins ?? '-'}</div>
          </div>
        </div>
      )}
      {/* Filtros e busca */}
      <div className="flex flex-wrap gap-2 items-center">
        <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="w-48" />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-slate-700 text-white rounded px-2 py-1">
          <option value="all">Todos</option>
          <option value="trader">Trader</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
          <option value="superadmin">SuperAdmin</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-slate-700 text-white rounded px-2 py-1">
          <option value="all">Todos</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
        <Button variant="secondary" onClick={() => setShowCreateManager(true)} className="ml-auto">
          <UserPlus className="h-4 w-4 mr-2" />Novo Manager
        </Button>
      </div>
      {/* Tabela de usuários */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center"><Loader2 className="animate-spin inline-block mr-2" />Carregando...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Nenhum usuário encontrado.</TableCell>
              </TableRow>
            ) : users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name || '-'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.is_active ? (
                    <span className="text-green-400 flex items-center"><UserCheck className="h-4 w-4 mr-1" />Ativo</span>
                  ) : (
                    <span className="text-red-400 flex items-center"><UserX className="h-4 w-4 mr-1" />Inativo</span>
                  )}
                </TableCell>
                <TableCell>{user.manager_id || '-'}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant={user.is_active ? 'destructive' : 'default'} onClick={() => handleToggleStatus(user.id)} disabled={actionLoading}>
                    {user.is_active ? 'Desativar' : 'Ativar'}
                  </Button>
                  {user.role === 'trader' && (
                    <Button size="sm" variant="secondary" onClick={() => setShowAssignManager(user.id)}>
                      Atribuir Gerente
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Paginação */}
      <div className="flex justify-end gap-2 mt-2">
        <Button size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</Button>
        <span className="text-white px-2">Página {page} de {totalPages}</span>
        <Button size="sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Próxima</Button>
      </div>
      {/* Modal de atribuição de gerente */}
      <Dialog open={!!showAssignManager} onOpenChange={v => !v && setShowAssignManager(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Gerente</DialogTitle>
          </DialogHeader>
          <Input placeholder="ID do Manager" value={managerId} onChange={e => setManagerId(e.target.value)} />
          <DialogFooter>
            <Button onClick={() => setShowAssignManager(null)} variant="secondary">Cancelar</Button>
            <Button onClick={() => handleAssignManager(showAssignManager!)} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}Atribuir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal de criação de manager */}
      <Dialog open={showCreateManager} onOpenChange={setShowCreateManager}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Manager</DialogTitle>
          </DialogHeader>
          <Input placeholder="Nome completo" value={newManager.full_name} onChange={e => setNewManager(n => ({ ...n, full_name: e.target.value }))} />
          <Input placeholder="Email" value={newManager.email} onChange={e => setNewManager(n => ({ ...n, email: e.target.value }))} />
          <Input placeholder="Senha" type="password" value={newManager.password} onChange={e => setNewManager(n => ({ ...n, password: e.target.value }))} />
          <DialogFooter>
            <Button onClick={() => setShowCreateManager(false)} variant="secondary">Cancelar</Button>
            <Button onClick={handleCreateManager} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
