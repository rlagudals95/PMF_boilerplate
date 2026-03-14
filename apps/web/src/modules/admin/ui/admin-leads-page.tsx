import { listLeads } from "@pmf/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@pmf/ui";

import { StatusBadge } from "@/modules/admin/ui/status-badge";

export default async function AdminLeadsPage() {
  const leads = await listLeads();

  return (
    <Card>
      <CardHeader>
        <CardTitle data-testid="admin-leads-heading">Lead inbox</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>관심 제품</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>유입</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium text-slate-950">{lead.name}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.email ?? "-"}</TableCell>
                <TableCell>{lead.productInterest}</TableCell>
                <TableCell>
                  <StatusBadge value={lead.status} />
                </TableCell>
                <TableCell>{lead.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
