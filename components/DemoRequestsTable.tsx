"use client";

import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateDemoRequestStatus } from "@/app/actions/demo-request-admin";

interface DemoRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  employee_count: string;
  created_at: string;
  status: string;
  notes?: string;
}

interface DemoRequestsTableProps {
  demoRequests: DemoRequest[];
}

export function DemoRequestsTable({ demoRequests }: DemoRequestsTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const result = await updateDemoRequestStatus(id, newStatus);

      if (!result.success) {
        alert(result.error || 'Erreur lors de la mise à jour');
      } else {
        // Refresh the page or update local state
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      contacted: { label: 'Contacté', variant: 'default' as const },
      scheduled: { label: 'Programmé', variant: 'default' as const },
      completed: { label: 'Terminé', variant: 'default' as const },
      cancelled: { label: 'Annulé', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Pays</TableHead>
              <TableHead>Employés</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demoRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.first_name} {request.last_name}
                </TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${request.email}`}
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    {request.email}
                  </a>
                </TableCell>
                <TableCell>
                  {request.phone && (
                    <a 
                      href={`tel:${request.phone}`}
                      className="text-green-600 hover:text-green-700 underline"
                    >
                      {request.phone}
                    </a>
                  )}
                </TableCell>
                <TableCell>{request.company}</TableCell>
                <TableCell>{request.country}</TableCell>
                <TableCell>{request.employee_count}</TableCell>
                <TableCell className="text-sm text-gray-500">
                  {formatDate(request.created_at)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(request.status)}
                </TableCell>
                <TableCell>
                  <Select
                    value={request.status}
                    onValueChange={(value) => handleStatusUpdate(request.id, value)}
                    disabled={updating === request.id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="contacted">Contacté</SelectItem>
                      <SelectItem value="scheduled">Programmé</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {demoRequests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune demande de démo pour le moment.
        </div>
      )}
    </div>
  );
}
