import { listProducts } from "@pmf/db";
import { Card, CardContent, CardHeader, CardTitle } from "@pmf/ui";

import { StatusBadge } from "@/modules/admin/ui/status-badge";

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <CardTitle>{product.name}</CardTitle>
              <StatusBadge value={product.stage} />
            </div>
            <p className="text-sm text-slate-500">{product.category}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">{product.oneLiner}</p>
            <div className="flex flex-wrap gap-2">
              {product.valueProps.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
