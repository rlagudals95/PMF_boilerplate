import { listPayments } from "@pmf/db";
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

const formatCurrency = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export default async function AdminPaymentsPage() {
  const payments = await listPayments();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
        <p className="text-sm text-slate-500">
          Toss 결제 생성과 결과 동기화 상태를 확인합니다.
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>주문번호</TableHead>
              <TableHead>상품</TableHead>
              <TableHead>구매자</TableHead>
              <TableHead>금액</TableHead>
              <TableHead>수단</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-xs text-slate-600">
                  {payment.orderNo}
                </TableCell>
                <TableCell className="font-medium text-slate-950">
                  {payment.productDescription}
                </TableCell>
                <TableCell>{payment.customerName}</TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell>{payment.payMethod ?? "-"}</TableCell>
                <TableCell>
                  <StatusBadge value={payment.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {payments.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            아직 생성된 결제 내역이 없습니다.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
